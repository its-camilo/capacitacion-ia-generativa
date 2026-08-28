function CodeBlock({ code, caption }) {
  return (
    <figure className="practica-code">
      {caption && <figcaption className="practica-code__caption">{caption}</figcaption>}
      <pre className="practica-code__pre">
        <code>{code}</code>
      </pre>
    </figure>
  )
}

export default CodeBlock
