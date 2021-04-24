import { useState } from 'react'
import { useSpringDialog } from '../../src/core'
export function Dialog() {
  const [isActive, setIsActive] = useState(false)
  const {
    Dialog,
    DialogWrapper,
    getDialogWrapperProps,
  } = useSpringDialog({
    isActive,
    onClose: () => setIsActive(false),
  })

  return (
    <div>
      <Dialog>
        <DialogWrapper {...getDialogWrapperProps()}>
          <div>Dialog example</div>
          <button onClick={() => setIsActive(false)}>HIDE</button>
        </DialogWrapper>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
