import { useState } from 'react'
import { Dialog } from '../..'

export function DialogExample() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div>
      <Dialog isActive={isActive} onClose={() => setIsActive(false)}>
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
