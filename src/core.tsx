import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'
import FocusTrap from 'focus-trap-react'
import ReactDOM from 'react-dom'

declare global {
  interface Window {
    __ACTIVE__REACT__SPRING__DIALOGS: number[]
  }
}

const isBrowser = typeof window !== 'undefined'

const InternalDialogContainer: React.FC = props => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999,
    }}
    {...props}
  />
)

function getActiveDialogs() {
  return window.__ACTIVE__REACT__SPRING__DIALOGS
}

export type Props = {
  initial?: UseSpringProps
  enter?: UseSpringProps
  leave?: UseSpringProps
  backdropSpringConfig?: {
    initial?: UseSpringProps['config']
    enter?: UseSpringProps['config']
    leave?: UseSpringProps['config']
  }
  useDefaultBackdropSpringConfig?: boolean
  backdropBackground?: string
  renderBackdrop?: boolean
  isActive: boolean
  focusTrapProps?: Omit<FocusTrap.Props, 'children'>
  children?: React.ReactNode
  ContainerComponent?: React.FC<HTMLAttributes<HTMLDivElement>>
  DialogComponent?: React.FC<HTMLAttributes<HTMLElement>>
  onClose(): void
} & HTMLAttributes<HTMLElement>

export const Dialog = ({
  children,
  initial = {
    opacity: 0,
  },
  enter = {
    opacity: 1,
  },
  leave = {
    opacity: 0,
  },
  backdropSpringConfig,
  useDefaultBackdropSpringConfig = true,
  isActive,
  onClose,
  backdropBackground = 'rgba(0,0,0,0.72)',
  renderBackdrop = true,
  focusTrapProps = {},
  ContainerComponent,
  DialogComponent,
  ...rest
}: Props) => {
  const dialogIndexId = useRef<null | number>(null)
  const portalTarget = useRef<HTMLElement | null>(null)
  const [inTheDom, setInTheDom] = useState(false)
  const [dialogStyles, setDialogStyles] = useSpring(() => initial)

  const getBackdropSpringSettings = useCallback(
    (phase: 'initial' | 'enter' | 'leave') => {
      if (useDefaultBackdropSpringConfig) {
        return {}
      }

      if (!!backdropSpringConfig) {
        if (phase === 'initial') {
          return backdropSpringConfig.initial
        }

        if (phase === 'enter') {
          return backdropSpringConfig.enter
        }

        return backdropSpringConfig.leave
      }

      if (phase === 'initial') {
        return initial.config
      }

      if (phase === 'enter') {
        return enter.config
      }

      return leave.config
    },
    [
      backdropSpringConfig,
      enter.config,
      initial.config,
      leave.config,
      useDefaultBackdropSpringConfig,
    ],
  )

  const [backdropStyles, setBackdropStyles] = useSpring(() => ({
    opacity: 0,
    config: getBackdropSpringSettings('initial'),
  }))

  const getIsCurrentActiveDialog = useCallback(() => {
    const activeDialogs = getActiveDialogs()

    return (
      activeDialogs[activeDialogs.length - 1] ===
      dialogIndexId.current
    )
  }, [])

  useEffect(() => {
    if (isBrowser && !getActiveDialogs()) {
      window.__ACTIVE__REACT__SPRING__DIALOGS = []
    }

    return () => {
      window.__ACTIVE__REACT__SPRING__DIALOGS = []
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const activeDialogs = getActiveDialogs()

    if (isActive) {
      if (activeDialogs.length === 0) {
        activeDialogs.push(0)
        dialogIndexId.current = 0
      } else if (dialogIndexId.current === null) {
        const newIndexId = activeDialogs.length - 1 + 1
        dialogIndexId.current = newIndexId
        activeDialogs.push(newIndexId)
      }
    }

    if (!isActive && inTheDom) {
      if (activeDialogs.length > 0 && getIsCurrentActiveDialog()) {
        window.__ACTIVE__REACT__SPRING__DIALOGS = getActiveDialogs().filter(
          v => v !== dialogIndexId.current,
        )
      }
    }
  }, [getIsCurrentActiveDialog, isActive, inTheDom])

  useEffect(() => {
    if (isBrowser && !portalTarget.current) {
      const _portalTarget = document.getElementById(
        '__REACT__SPRING__DIALOG__PORTAL__CONTAINER__',
      )

      if (_portalTarget) {
        portalTarget.current = _portalTarget
      } else {
        const _target = document.createElement('div')
        _target.setAttribute(
          'id',
          '__REACT__SPRING__DIALOG__PORTAL__CONTAINER__',
        )

        document.body.appendChild(_target)
        portalTarget.current = _target
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && !inTheDom) {
      setInTheDom(true)

      if (renderBackdrop) {
        setBackdropStyles.start({
          opacity: 1,
          config: getBackdropSpringSettings('enter'),
        })
      }

      setDialogStyles.start(enter)
    }

    if (!isActive && inTheDom) {
      if (renderBackdrop) {
        setBackdropStyles.start({
          opacity: 0,
          config: getBackdropSpringSettings('leave'),
        })
      }

      setDialogStyles.start({
        ...leave,
        onRest: (p, ctrl) => {
          if (typeof leave.onRest === 'function') {
            leave.onRest(p, ctrl)
          }

          setDialogStyles.start({
            ...initial,
            immediate: true,
          })

          setInTheDom(false)
          dialogIndexId.current = null
        },
      })
    }
  }, [
    enter,
    getBackdropSpringSettings,
    inTheDom,
    initial,
    isActive,
    leave,
    renderBackdrop,
    setBackdropStyles,
    setDialogStyles,
  ])

  useEffect(() => {
    function handleOnEscKey(event: KeyboardEvent) {
      if (
        event.key === 'Escape' &&
        isActive &&
        getIsCurrentActiveDialog()
      ) {
        onClose()
      }
    }

    if (isBrowser) {
      document.addEventListener('keydown', handleOnEscKey)

      return () => {
        document.removeEventListener('keydown', handleOnEscKey)
      }
    }
  }, [getIsCurrentActiveDialog, isActive, onClose])

  useEffect(() => {
    if (isActive && getActiveDialogs().length === 1) {
      document.body.style.overflow = 'hidden'
    }

    if (!isActive && getActiveDialogs().length === 0) {
      document.body.style.overflow = 'unset'
    }
  }, [isActive])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const wrapper = document.querySelector(
        `[data-target="__react__spring__dialog__-${dialogIndexId.current}"]`,
      )

      if (
        !wrapper?.contains(e.target as Node) &&
        getIsCurrentActiveDialog()
      ) {
        onClose()
      }
    }

    if (isActive) {
      document.addEventListener('click', handleClick)

      return () => {
        document.removeEventListener('click', handleClick)
      }
    }
  }, [getIsCurrentActiveDialog, isActive, onClose])

  const DialogContainer = ContainerComponent
    ? animated(ContainerComponent)
    : InternalDialogContainer
  const DialogWrapper = DialogComponent
    ? animated(DialogComponent)
    : animated.div

  const dialog = (
    <DialogContainer data-testid="react-spring-dialog-container">
      {renderBackdrop && (
        <animated.div
          data-testid="react-spring-dialog-backdrop"
          style={{
            ...backdropStyles,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundColor: backdropBackground,
          }}
        />
      )}
      <FocusTrap
        {...focusTrapProps}
        focusTrapOptions={{
          allowOutsideClick: true,
          ...focusTrapProps.focusTrapOptions,
        }}
      >
        <DialogWrapper
          data-testid="react-spring-dialog-wrapper"
          {...rest}
          style={{
            ...dialogStyles,
            ...rest.style,
          }}
          role="dialog"
          aria-modal="true"
          data-target={`__react__spring__dialog__-${dialogIndexId.current}`}
        >
          {children}
        </DialogWrapper>
      </FocusTrap>
    </DialogContainer>
  )

  return inTheDom && portalTarget.current
    ? ReactDOM.createPortal(dialog, portalTarget.current)
    : null
}
