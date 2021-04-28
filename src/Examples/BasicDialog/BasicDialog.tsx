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
        backdropSpringConfig={{
          initial: {
            tension: 1,
          },
        }}
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
          config: {
            tension: 9000,
          },
        }}
        leave={{
          scale: 1.1,
          opacity: 0,
          config: {
            tension: 900,
          },
        }}
      >
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
