'use client'

import { Conversation, GroupedChatHistory } from '@/app/api/model/chatModel'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import * as React from 'react';
import { useState, useContext, useEffect, useRef } from 'react'
import { AppStateContext } from '@/lib/AppProvider'
import { historyList } from '@/app/api/api'

interface SidebarItemsProps {
  chats?: GroupedChatHistory[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  const [, setSelectedItem] = React.useState<Conversation | null>(null);
  const observerTarget = useRef(null);
  const appStateContext = useContext(AppStateContext);
  const firstRender = useRef(true);
  const [offset, setOffset] = useState<number>(25);
  const [observerCounter, setObserverCounter] = useState(0);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    handleFetchHistory();
    setOffset((offset) => offset += 25);
  }, [observerCounter]);

  const handleFetchHistory = async () => {
    const currentChatHistory = appStateContext?.state.chatHistory;
    // setShowSpinner(true);

    await historyList(offset).then((response) => {
      const concatenatedChatHistory = currentChatHistory && response && currentChatHistory.concat(...response)
      if (response) {
        appStateContext?.dispatch({ type: 'FETCH_CHAT_HISTORY', payload: concatenatedChatHistory || response });
      } else {
        appStateContext?.dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null });
      }
      // setShowSpinner(false);
      return response
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting)
          setObserverCounter((observerCounter) => observerCounter += 1);
      },
      { threshold: 1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget]);

  const handleSelectHistory = (item?: Conversation) => {
    if (item) {
      setSelectedItem(item)
    }
  }

  if (!chats?.length) return null

  return (
    <AnimatePresence>
    {chats && chats.map((group, groupIndex) => (
      <motion.div
        key={groupIndex}
        exit={{
          opacity: 0,
          height: 0
        }}
      >
        <div className="group-header text-xl text-gray-700 font-bold">{group.month}</div>
        {group.entries.map((chat, index) => (
          <SidebarItem key={chat.id} index={index} chat={chat} onSelect={() => handleSelectHistory(chat)}>
            <SidebarActions chat={chat} />
          </SidebarItem>
        ))}
      </motion.div>
    ))}
  </AnimatePresence>
  )
}
