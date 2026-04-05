interface Props {
  html: string;
  className?: string;
}

export function RichTextContent({ html, className = "" }: Props) {
  if (!html) return null;
  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
