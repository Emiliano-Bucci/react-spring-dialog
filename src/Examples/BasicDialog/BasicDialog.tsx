import { useState } from 'react'
import { Dialog } from '../..'

export function BasicDialog() {
  const [isActive, setIsActive] = useState(false)
  const [isActive2, setIsActive2] = useState(false)

  return (
    <div>
      <Dialog isActive={isActive} onClose={() => setIsActive(false)}>
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
        <button onClick={() => setIsActive2(true)}>SHOW</button>
        <Dialog
          isActive={isActive2}
          onClose={() => setIsActive2(false)}
        >
          <div>Dialog example</div>
          <button onClick={() => setIsActive2(false)}>HIDE</button>
        </Dialog>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
