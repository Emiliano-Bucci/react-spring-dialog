import { Dialog, Props as DialogProps } from '../../src'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Globals } from 'react-spring'

beforeAll(() => {
  Globals.assign({
    skipAnimation: true,
  })
})

afterAll(() => {
  Globals.assign({
    skipAnimation: false,
  })
})

beforeEach(() => {
  window.__ACTIVE__REACT__SPRING__DIALOGS = []
})

const TestDialog = (props: Partial<DialogProps>) => {
  const [isActive, setIsActive] = useState(true)
  return (
    <Dialog
      isActive={isActive}
      onClose={() => setIsActive(false)}
      {...props}
    >
      <div>Dialog example</div>
      <button onClick={() => setIsActive(false)}>HIDE</button>
    </Dialog>
  )
}

describe('Basic Dialog', () => {
  test('Snapshot', () => {
    const { baseElement } = render(<TestDialog />)

    expect(baseElement).toMatchSnapshot()
  })

  test('Render dialog container', () => {
    render(<TestDialog />)

    const backdrop = screen.getByTestId(
      'react-spring-dialog-container',
    )

    expect(backdrop).toBeInTheDocument()
  })

  test('Render custom ContainerComponent', () => {
    render(
      <TestDialog
        ContainerComponent={props => (
          <div {...props} data-testid="custom-container-component">
            {props.children}
          </div>
        )}
      />,
    )

    const customContainerComponent = screen.getByTestId(
      'custom-container-component',
    )

    expect(customContainerComponent).toBeInTheDocument()
  })

  test('Render dialog backgropd', () => {
    render(<TestDialog />)

    const backdrop = screen.getByTestId(
      'react-spring-dialog-backdrop',
    )

    expect(backdrop).toBeInTheDocument()
  })

  test("Don't render dialog backgropd", () => {
    render(<TestDialog renderBackdrop={false} />)

    const backdrop = screen.queryByTestId(
      'react-spring-dialog-backdrop',
    )

    expect(backdrop).not.toBeInTheDocument()
  })

  test('Render dialog wrapper', () => {
    render(<TestDialog />)

    const backdrop = screen.getByTestId('react-spring-dialog-wrapper')

    expect(backdrop).toBeInTheDocument()
  })

  test('Render custom DialogComponent', () => {
    render(
      <TestDialog
        DialogComponent={props => (
          <div {...props} data-testid="custom-dialog-component">
            {props.children}
          </div>
        )}
      />,
    )

    const customDialogComponent = screen.getByTestId(
      'custom-dialog-component',
    )

    expect(customDialogComponent).toBeInTheDocument()
  })

  test('Render dialog role', () => {
    render(<TestDialog />)

    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  test('Call onClose when user click in the backdrop', () => {
    const onClose = jest.fn()
    render(<TestDialog onClose={onClose} />)

    const backdrop = screen.getByTestId(
      'react-spring-dialog-backdrop',
    )

    fireEvent.click(backdrop)

    expect(onClose).toBeCalledTimes(1)
  })

  test('Call onClose when user press the Escape kew', () => {
    const onClose = jest.fn()
    render(<TestDialog onClose={onClose} />)

    fireEvent(
      document,
      new KeyboardEvent('keydown', {
        key: 'Escape',
      }),
    )

    expect(onClose).toBeCalledTimes(1)
  })

  test('Call correct onClose order when user press the Escape kew', () => {
    const onClose1 = jest.fn()
    const onClose2 = jest.fn()
    render(
      <Dialog isActive={true} onClose={onClose1}>
        <div>Dialog example1</div>
        <button>Close</button>
        <Dialog isActive={true} onClose={onClose2}>
          <div>Dialog example2</div>
          <button>Close</button>
        </Dialog>
      </Dialog>,
    )

    fireEvent(
      document,
      new KeyboardEvent('keydown', {
        key: 'Escape',
      }),
    )

    expect(onClose1).toBeCalledTimes(0)
    expect(onClose2).toBeCalledTimes(1)
  })

  test('window.__ACTIVE__REACT__SPRING__DIALOGS should contain 1 item and item should be 0', () => {
    render(<TestDialog />)

    const activeDialogs = window.__ACTIVE__REACT__SPRING__DIALOGS

    expect(activeDialogs).toHaveLength(1)
    expect(activeDialogs[0]).toEqual(0)
  })

  test('window.__ACTIVE__REACT__SPRING__DIALOGS should contain 2 items and items should be 0 & 1', () => {
    render(
      <Dialog isActive={true} onClose={jest.fn()}>
        <div>Dialog example1</div>
        <button>Close</button>
        <Dialog isActive={true} onClose={jest.fn()}>
          <div>Dialog example2</div>
          <button>Close</button>
        </Dialog>
      </Dialog>,
    )

    const activeDialogs = window.__ACTIVE__REACT__SPRING__DIALOGS

    expect(activeDialogs).toHaveLength(2)
    expect(activeDialogs[0]).toEqual(0)
    expect(activeDialogs[1]).toEqual(1)
  })

  test('window.__ACTIVE__REACT__SPRING__DIALOGS should contain 1 item and item should be 0', () => {
    render(
      <Dialog isActive={true} onClose={jest.fn()}>
        <div>Dialog example1</div>
        <button>Close</button>
        <Dialog isActive={false} onClose={jest.fn()}>
          <div>Dialog example2</div>
          <button>Close</button>
        </Dialog>
      </Dialog>,
    )

    const activeDialogs = window.__ACTIVE__REACT__SPRING__DIALOGS

    expect(activeDialogs).toHaveLength(1)
    expect(activeDialogs[0]).toEqual(0)
  })
})
