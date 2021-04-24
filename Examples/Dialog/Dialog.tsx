import { useSpringDialog } from '../../src/core'
export function Dialog() {
  const {
    Dialog,
    DialogWrapper,
    getDialogWrapperProps,
    dispatch,
  } = useSpringDialog({
    initial: {
      y: 0,
    },
    enter: {
      opacity: 1,
      y: 10,
    },
    leave: {
      opacity: 0,
      y: 20,
    },
  })
  return (
    <div>
      <Dialog>
        <DialogWrapper {...getDialogWrapperProps()}>
          <div>Dialog example</div>
          <button onClick={() => dispatch('hide')}>HIDE</button>
        </DialogWrapper>
      </Dialog>
      <button onClick={() => dispatch('show')}>SHOW</button>
    </div>
  )
}
