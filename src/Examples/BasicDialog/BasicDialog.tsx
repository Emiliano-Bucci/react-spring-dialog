import { useState } from 'react'
import { Dialog } from '../..'

export function BasicDialog() {
  const [isActive, setIsActive] = useState(true)
  const [isActive2, setIsActive2] = useState(true)

  function handleOnClose() {
    setIsActive(false)
  }

  return (
    <div>
      <Dialog
        isActive={isActive}
        onClose={handleOnClose}
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
        style={{
          padding: 40,
          background: 'red',
        }}
      >
        <div>Dialog example</div>
        <button onClick={() => setIsActive(false)}>HIDE</button>
        <button onClick={() => setIsActive2(true)}>
          SHOW DIALOG 2
        </button>
      </Dialog>
      <button onClick={() => setIsActive(true)}>SHOW</button>
      <Dialog
        isActive={isActive2}
        onClose={() => setIsActive2(false)}
        style={{
          padding: 40,
          background: 'red',
        }}
      >
        <button onClick={() => setIsActive2(false)}>
          CLOSEEE MEEEE
        </button>
      </Dialog>
    </div>
  )
}
