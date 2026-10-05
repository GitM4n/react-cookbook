import { useState } from 'react'

export default function HeavyPanel() {
  const [rows] = useState(() =>
    Array.from({ length: 6 }, (_, index) => ({ id: index + 1, value: `строка ${index + 1}` })),
  )

  return (
    <div className="panel stack">
      <b>HeavyPanel — отдельный модуль</b>
      <table className="table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>#{row.id}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className="muted">
        Этот код попал в страницу только после первого открытия: <code>import()</code> создал отдельный файл
        бандла.
      </span>
    </div>
  )
}
