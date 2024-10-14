import { Message } from '@/app/api/model/chatModel'
import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'

export interface ChatList {
  messages: Message[];
  stopChatGeneration: boolean;
}

export function ChatList({ messages, stopChatGeneration }: ChatList) {
  if (!messages.length) {
    return null
  }

  // Find the index of the most recent assistant message
  const mostRecentAssistantIndex = messages.slice().reverse().findIndex(msg => msg.role === 'assistant');

  // Check if the current message is the most recent assistant message
  const isMostRecentAssistantMessage = mostRecentAssistantIndex !== -1 && messages.length - 1 - mostRecentAssistantIndex === 0;

  if (stopChatGeneration && isMostRecentAssistantMessage) {
    return null; // Skip rendering the most recent assistant message when chat generation is stopped
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        message.role !== 'tool' ? (
          <div key={index}>
            <ChatMessage message={message} stopChatGeneration={stopChatGeneration} />
            {index < messages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
          </div>) : null
      ))}
    </div>
  )
}
