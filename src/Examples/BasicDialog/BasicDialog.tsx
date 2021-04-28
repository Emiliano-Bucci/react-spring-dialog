import { useState } from 'react'
import { Dialog } from '../..'

export function BasicDialog() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div>
      <Dialog
        isActive={isActive}
        onClose={() => setIsActive(false)}
        style={{
          backgroundColor: '#fff',
        }}
        useDefaultBackdropSpringConfig={false}
        initial={{
          scale: 0.9,
          opacity: 0,
          config: {
            tension: 1000,
          },
        }}
        enter={{
          scale: 1,
          opacity: 1,
        }}
        leave={{
          scale: 1.1,
          opacity: 0,
        }}
      >
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
