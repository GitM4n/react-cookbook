import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Counter from './Counter'

afterEach(cleanup)

describe('Counter', () => {
  it('показывает переданное начальное значение', () => {
    render(<Counter initial={3} />)
    expect(screen.getByTestId('value').textContent).toBe('Значение: 3')
  })

  it('увеличивает значение по клику', () => {
    render(<Counter />)
    fireEvent.click(screen.getByText('Увеличить'))
    fireEvent.click(screen.getByText('Увеличить'))
    expect(screen.getByTestId('value').textContent).toBe('Значение: 2')
  })

  it('возвращает начальное значение по кнопке «Сбросить»', () => {
    render(<Counter initial={5} />)
    fireEvent.click(screen.getByText('Увеличить'))
    fireEvent.click(screen.getByText('Сбросить'))
    expect(screen.getByTestId('value').textContent).toBe('Значение: 5')
  })

  it('показывает бейдж только после перехода порога', () => {
    render(<Counter />)
    expect(screen.queryByText('Счётчик перешёл порог')).toBeNull()

    for (let i = 0; i < 6; i += 1) {
      fireEvent.click(screen.getByText('Увеличить'))
    }

    expect(screen.getByText('Счётчик перешёл порог')).toBeTruthy()
  })
})
