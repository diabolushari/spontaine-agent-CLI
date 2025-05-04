export default function extractJsonMarkdown(markdown: string): RegExpMatchArray | null {
  return markdown.match(/```json(.*?)```/s)
}
