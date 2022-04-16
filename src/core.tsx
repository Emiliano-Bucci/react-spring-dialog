import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'
import FocusTrap from 'focus-trap-react'
import ReactDOM from 'react-dom'

declare global {
  interface Window {
    __ACTIVE__REACT__SPRING__DIALOGS: string[]
  }
}

function InternalDialogContainer({
  children,
  style,
  ...rest
}: {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>) {
  return (
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
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function getActiveDialogs() {
  return window.__ACTIVE__REACT__SPRING__DIALOGS
}

export type Props = {
  initial?: UseSpringProps
  enter?: UseSpringProps
  leave?: UseSpringProps
  closeDialonOnOutsideClick?: boolean
  closeDialogOnEscKeyPress?: boolean
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
  closeDialonOnOutsideClick = true,
  closeDialogOnEscKeyPress = true,
  ...rest
}: Props) => {
  const uniqueId = useId()
  const dialogId = useRef(uniqueId)
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
      activeDialogs[activeDialogs.length - 1] === dialogId.current
    )
  }, [])

  useLayoutEffect(() => {
    window.__ACTIVE__REACT__SPRING__DIALOGS = []
  }, [])

  useEffect(() => {
    return () => {
      if (getActiveDialogs().length === 0) {
        window.__ACTIVE__REACT__SPRING__DIALOGS = []
        document.body.style.overflow = 'unset'
      }
    }
  }, [])

  useEffect(() => {
    const activeDialogs = getActiveDialogs()

    if (
      isActive &&
      !window.__ACTIVE__REACT__SPRING__DIALOGS.includes(
        dialogId.current,
      )
    ) {
      window.__ACTIVE__REACT__SPRING__DIALOGS.push(dialogId.current)
    }

    if (!isActive && inTheDom) {
      if (activeDialogs.length > 0 && getIsCurrentActiveDialog()) {
        window.__ACTIVE__REACT__SPRING__DIALOGS =
          getActiveDialogs().filter(v => v !== dialogId.current)
      }
    }
  }, [getIsCurrentActiveDialog, isActive, inTheDom])

  useEffect(() => {
    if (!portalTarget.current) {
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
        getIsCurrentActiveDialog() &&
        closeDialogOnEscKeyPress
      ) {
        onClose()
      }
    }

    if (isActive) {
      document.addEventListener('keydown', handleOnEscKey)
      return () => {
        document.removeEventListener('keydown', handleOnEscKey)
      }
    }
  }, [
    getIsCurrentActiveDialog,
    isActive,
    onClose,
    closeDialogOnEscKeyPress,
  ])
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
      const container = document.querySelector(
        `[data-id="react__spring__dialog__container__${dialogId.current}"]`,
      )
      const wrapper = document.querySelector(
        `[data-target="__react__spring__dialog__-${dialogId.current}"]`,
      )

      if (
        wrapper &&
        !wrapper.contains(e.target as Node) &&
        container &&
        container.contains(e.target as Node) &&
        getIsCurrentActiveDialog() &&
        closeDialonOnOutsideClick
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
  }, [
    getIsCurrentActiveDialog,
    isActive,
    onClose,
    closeDialonOnOutsideClick,
  ])

  const DialogContainer = ContainerComponent
    ? animated(ContainerComponent)
    : InternalDialogContainer
  const DialogWrapper = DialogComponent
    ? animated(DialogComponent)
    : animated.div

  const dialog = (
    <DialogContainer
      data-testid="react-spring-dialog-container"
      data-id={`react__spring__dialog__container__${dialogId.current}`}
    >
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
            willChange: 'opacity',
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
          role="dialog"
          aria-modal="true"
          data-target={`__react__spring__dialog__-${dialogId.current}`}
          style={{
            ...dialogStyles,
            ...rest.style,
            willChange: 'transform, opacity',
          }}
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
