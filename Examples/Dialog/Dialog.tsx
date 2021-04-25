import { useState } from 'react'
import { Dialog } from '../../src/core'

const Wrapper: React.FC = props => (
  <div {...props}>{props.children}</div>
)

export function DialogExample() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div>
      <Dialog
        isActive={isActive}
        onClose={() => setIsActive(false)}
        WrapperComponent={Wrapper}
      >
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
