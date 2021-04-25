import { useState } from 'react'
import { Dialog } from '../..'

export function DialogExample() {
  const [isActive, setIsActive] = useState(false)
  const [isActive1, setIsActive1] = useState(false)

  return (
    <div>
      <Dialog isActive={isActive} onClose={() => setIsActive(false)}>
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
        <button onClick={() => setIsActive1(true)}>SHOW</button>
        <Dialog
          isActive={isActive1}
          onClose={() => setIsActive1(false)}
        >
          <div>Dialog example</div>
          <button onClick={() => setIsActive1(false)}>HIDE</button>
        </Dialog>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
