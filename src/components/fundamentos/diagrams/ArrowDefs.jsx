function ArrowDefs({ id = 'arrowhead' }) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth="8"
        markerHeight="6"
        refX="7"
        refY="3"
        orient="auto"
      >
        <polygon points="0 0, 8 3, 0 6" fill="var(--color-muted)" />
      </marker>
    </defs>
  )
}

export default ArrowDefs
