interface LegendProps {
  payload: {
    value: string
    color: string
  }[]
}

const CustomLegend = ({ payload }: LegendProps) => {
  return (
    <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{ marginRight: 10, fontSize: 8 }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              backgroundColor: entry.color,
              marginRight: 5,
              paddingTop: 1,
            }}
          />
          <br />
          {entry.value}
        </li>
      ))}
    </ul>
  )
}

export default CustomLegend
