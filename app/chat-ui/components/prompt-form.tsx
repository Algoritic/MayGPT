import React, { useState } from 'react';
import Textarea from 'react-textarea-autosize';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';

export interface PromptProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (question: string, id?: string) => void; // Ensure this prop is present
  isLoading: boolean;
  conversationId?: string;
  newChat: () => void;
}

export function PromptForm({ input, setInput, onSubmit, isLoading, conversationId, newChat }: PromptProps) {
  const { formRef } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const submitFunction = () => {
    if (conversationId) {
      onSubmit(input, conversationId);
    } else {
      onSubmit(input);
    }
    // Trigger custom function
    setInput(''); // Clear input after sending
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      submitFunction()
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} ref={formRef}>
      <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                router.refresh();
                newChat()
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onEnterPress}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                disabled={isLoading || input === ''}
                onClick={() => {
                  submitFunction()
                }}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}