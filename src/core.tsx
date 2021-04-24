import { useEffect, useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'
import FocusTrap from 'focus-trap-react'

type Props = {
  initial?: UseSpringProps
  enter?: UseSpringProps
  leave?: UseSpringProps
  backdropBackground?: string
  renderBackdrop?: boolean
  isActive: boolean
  focusTrapProps?: Omit<FocusTrap.Props, 'children'>
  onClose(): void
}

const DialogWrapper = animated.div

export function useSpringDialog({
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
}: Props) {
  const [inTheDom, setInTheDom] = useState(false)
  const [dialogStyles, setDialogStyles] = useSpring(() => initial)
  const backdropStyles = useSpring({
    opacity: isActive ? 1 : 0,
  })

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

  function getDialogWrapperProps() {
    return {
      style: dialogStyles,
    }
  }

  const Dialog: React.FC = ({ children }) => {
    const dialog = (
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
        <FocusTrap {...focusTrapProps}>{children}</FocusTrap>
      </div>
    )
    return inTheDom ? dialog : null
  }

  return {
    Dialog,
    DialogWrapper,
    getDialogWrapperProps,
  }
}
