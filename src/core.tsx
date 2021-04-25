import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'
import FocusTrap from 'focus-trap-react'
import ReactDOM from 'react-dom'

const InternalDialogContainer: React.FC = ({ children }) => (
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
    }}
  >
    {children}
  </div>
)

type Props = {
  initial?: UseSpringProps
  enter?: UseSpringProps
  leave?: UseSpringProps
  backdropBackground?: string
  renderBackdrop?: boolean
  isActive: boolean
  focusTrapProps?: Omit<FocusTrap.Props, 'children'>
  children?: React.ReactNode
  WrapperComponent?: React.FC
  ContainerComponent?: React.FC
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
  isActive,
  onClose,
  backdropBackground = 'rgba(0,0,0,0.72)',
  renderBackdrop = true,
  focusTrapProps = {},
  ContainerComponent,
  WrapperComponent,
  ...rest
}: Props) => {
  const portalTarget = useRef<HTMLElement | null>(null)
  const [inTheDom, setInTheDom] = useState(false)
  const [dialogStyles, setDialogStyles] = useSpring(() => initial)
  const backdropStyles = useSpring({
    opacity: isActive ? 1 : 0,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _portalTarget = document.getElementById(
        '__REACT_SPRING_DIALOG__PORTAL__CONTAINER__',
      )

      if (_portalTarget) {
        portalTarget.current = (portalTarget as unknown) as HTMLElement
      } else {
        const _target = document.createElement('div')
        _target.setAttribute(
          'id',
          '__REACT_SPRING_DIALOG__PORTAL__CONTAINER__',
        )

        document.body.appendChild(_target)
        portalTarget.current = _target
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && !inTheDom) {
      setInTheDom(true)
      setDialogStyles.start(enter)
    }

    if (!isActive && inTheDom) {
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
  }, [enter, inTheDom, initial, isActive, leave, setDialogStyles])

  const DialogContainer = ContainerComponent
    ? ContainerComponent
    : InternalDialogContainer
  const DialogWrapper = WrapperComponent
    ? animated(WrapperComponent)
    : animated.div

  const dialog = (
    <DialogContainer>
      {renderBackdrop && (
        <animated.div
          onClick={onClose}
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
      <FocusTrap {...focusTrapProps}>
        <DialogWrapper
          role="dialog"
          aria-modal="true"
          style={dialogStyles}
          {...rest}
        >
          {children}
        </DialogWrapper>
      </FocusTrap>
    </DialogContainer>
  )

  return inTheDom
    ? ReactDOM.createPortal(dialog, portalTarget.current as Element)
    : null
}
