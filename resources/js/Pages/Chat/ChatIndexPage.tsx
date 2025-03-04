import Chat from '@/Chat/Chat'

interface Props {
  chatToken: string
}

export default function ChatIndexPage({ chatToken }: Readonly<Props>) {
  return <Chat chatToken={chatToken} />
}
