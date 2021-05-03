import { useState } from 'react'
import { Dialog } from '../..'

export function BasicDialog() {
  const [isActive, setIsActive] = useState(false)
  const [a, setA] = useState(true)

  return (
    <div>
      <Dialog
        isActive={isActive}
        onClose={() => setIsActive(false)}
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
        {a && (
          <div>
            <input type="text" />
          </div>
        )}
        <button onClick={() => setA(p => !p)}>TOGGLE A</button>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
    </div>
  )
}
