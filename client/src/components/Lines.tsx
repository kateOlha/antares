export function Lines({ text }: { text: string }) {
  const parts = text.replace(/\r/g, "").split("\n");
  return (
    <>
      {parts.map((line, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}
