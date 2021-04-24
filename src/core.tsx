import { useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

type DispatchActions = 'show' | 'hide'

type Props = {
  initial?: UseSpringProps
  enter?: UseSpringProps
  leave?: UseSpringProps
  backdropBackground?: string
  renderBackdrop?: boolean
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
  backdropBackground = 'rgba(0,0,0,0.72)',
  renderBackdrop = true,
}: Props = {}) {
  const [inTheDom, setInTheDom] = useState(false)
  const [dialogStyles, setDialogStyles] = useSpring(() => initial)
  const [backdropStyles, setBackdropStyles] = useSpring(() => ({
    opacity: 0,
  }))

  function showDialog() {
    setInTheDom(true)
    setBackdropStyles.start({
      opacity: 1,
    })
    setDialogStyles.start(enter)
  }
  function hideDialog() {
    setBackdropStyles.start({
      opacity: 0,
    })
    setDialogStyles.start({
      ...leave,
      onRest: (p, ctrl) => {
        setInTheDom(false)

        if (typeof leave.onRest === 'function') {
          leave.onRest(p, ctrl)
        }

        setDialogStyles.start({ ...initial, immediate: true })
      },
    })
  }
  function dispatch(type: DispatchActions) {
    if (type === 'show') {
      showDialog()
    } else {
      hideDialog()
    }
  }
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
            onClick={() => dispatch('hide')}
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
        {children}
      </div>
    )
    return inTheDom ? dialog : null
  }

  return {
    Dialog,
    DialogWrapper,
    getDialogWrapperProps,
    dispatch,
  }
}
