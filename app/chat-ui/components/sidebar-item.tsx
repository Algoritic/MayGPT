'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

import { buttonVariants } from '@/components/ui/button'
import { IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Conversation } from '@/app/api/model/chatModel'
import { cn } from '@/lib/utils'
import { useContext } from 'react'
import { AppStateContext } from '@/lib/AppProvider'


interface SidebarItemProps {
  index: number
  chat: Conversation
  onSelect: (item: Conversation | null) => void;
  children: React.ReactNode
}

export function SidebarItem({ index, chat, onSelect, children }: SidebarItemProps) {
  const appStateContext = useContext(AppStateContext);
  const isActive = chat?.id === appStateContext?.state.currentChat?.id;
  // const [newChatId, setNewChatId] = useState(appStateContext?.state.currentChat?.id)
  const shouldAnimate = index === 0 && isActive

  if (!chat?.id) return null

  const handleSelectItem = () => {
    onSelect(chat)
    appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: chat })
  }

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
      onClick={handleSelectItem} // Trigger handleSelectItem on click
    >
      <div
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
          isActive && 'bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      // setNewChatId(null)
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </div>
      {/* {isActive && <div className="absolute right-2 top-1">{children}</div>} */}
    </motion.div>
  );
}
