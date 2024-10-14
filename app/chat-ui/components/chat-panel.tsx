import * as React from 'react'

// import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconShare, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
// import { ChatShareDialog } from '@/components/chat-share-dialog'
import { Message } from '@/app/api/model/chatModel'
import { useState } from 'react'

export interface ChatPanelProps {
  id?: string;
  title?: string;
  messages: Message[];
  isLoading: boolean;
  input: string;
  setInput: (value: string) => void;
  onSendMessage: (question: string, id?: string) => void;
  stopGenerating: () => void;
  conversationId?: string;
  newChat: () => void;
}

export function ChatPanel({
  id,
  title,
  messages,
  isLoading,
  input,
  setInput,
  onSendMessage,
  stopGenerating,
  conversationId,
  newChat
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const getPreviousUserInput = (messages: Message[]) => {
    // Find the most recent user message
    let newMessages = [...messages];
    const userMessage = newMessages.reverse().find(message => message.role === 'user');
    // Extract and return the input from the user message
    return userMessage?.content || '';
  };

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-12">
          {isLoading ? (
            <Button variant="outline" className="bg-background" onClick={() => stopGenerating()}>
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => onSendMessage(getPreviousUserInput(messages), id)}>
                  <IconRefresh className="mr-2" />
                  Regenerate response
                </Button>
                {id && title ? (
                  <>
                    <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                      <IconShare className="mr-2" />
                      Share
                    </Button>
                    {/* <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat} // Replace with your share action
                      chat={{
                        id,
                        title,
                        messages,
                      }}
                    /> */}
                  </>
                ) : null}
              </div>
            )
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            input={input}
            setInput={setInput}
            onSubmit={onSendMessage} // Pass the actual function
            isLoading={isLoading}
            conversationId={conversationId}
            newChat={newChat}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}