# React Spring Dialog

> A simple, accessible and performant Dialog component powered by `react-spring`.

## Features

- Excelent performances thanks to `react-spring`.
- **Accessibility** ready thanks to the use of `focus-trap-react` among other things.
- Easy to style and to configure: no more headaches or hacky things trying to make the Dialog looks like we want.

## Install

```bash
npm install --save react-spring-dialog
```

or

```bash
yarn add react-spring-dialog
```

## How to use it

```tsx
import { Dialog } from 'react-spring-dialog'

export function Component() {
  const [isActive, setIsActive] = useState(true)

  return (
    <Dialog isActive={isActive} onClose={() => setIsActive(false)}>
      <div>Dialog content</div>
      <button onClick={() => setIsActive(false)}>CLOSE</button>
    </Dialog>
  )
}
```

## Official documentation

[Visit here](https://react-spring-dialog.emilianobucci.com)
