# React Spring Dailog

> A simple, accessible and performant dialog component powered by `react-spring`.

## Features

- Excelent performances thanks to `react-spring`.
- **Accessibility** ready thanks to the use of `react-focus-trap` among other things.
- Easy to style and to configure: no more headaches or hacky things trying to make the Dialog looks like we want.

## Install

```bash
npm install --save react-spring-dialog
```

or

```bash
yarn add --save react-spring-dialog
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

[Visit here](https://react-spring-dialogemilianobucci.com)
