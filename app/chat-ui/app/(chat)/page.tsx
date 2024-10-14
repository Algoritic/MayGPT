import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import uuid from 'react-uuid'

export default function IndexPage() {
  const id = uuid()

  return <Chat id={id} />
}
