'use client'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { AppStateContext } from '@/lib/AppProvider'
import { useContext, useState, useEffect } from 'react'
import { Conversation, GroupedChatHistory } from '@/app/api/model/chatModel'

interface SidebarListProps {
  children?: React.ReactNode
}



const groupByMonth = (entries: Conversation[]) => {
  const groups: GroupedChatHistory[] = [{ month: "Recent", entries: [] }];
  const currentDate = new Date();

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const daysDifference = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    const existingGroup = groups.find((group) => group.month === monthYear);
      
    if(daysDifference <= 7){
      groups[0].entries.push(entry);
    } else {
      if (existingGroup) {
        existingGroup.entries.push(entry);
      } else {
        groups.push({ month: monthYear, entries: [entry] });
      }
    }
  });

  groups.sort((a, b) => {
    if (a.entries.length === 0 && b.entries.length === 0) {
      return 0;
    } else if (a.entries.length === 0) {
      return 1;
    } else if (b.entries.length === 0) {
      return -1;
    }
    const dateA = new Date(a.entries[0].date);
    const dateB = new Date(b.entries[0].date);
    return dateB.getTime() - dateA.getTime();
  });

  groups.forEach((group) => {
    group.entries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  });

  return groups;
};

export function SidebarList({  }: SidebarListProps) {
  const appStateContext = useContext(AppStateContext);
  const [groupedChatHistory, setGroupedChatHistory] = useState<GroupedChatHistory[] | undefined>(undefined);

  useEffect(() => {
    async function fetchChats() {
       console.log('reached here 99', appStateContext?.state.chatHistory)
      if (appStateContext && appStateContext.state.chatHistory && appStateContext.state.chatHistory.length > 0) {
        const groups = groupByMonth(appStateContext.state.chatHistory);
        setGroupedChatHistory(groups);
      }
    }
    fetchChats();
  }, [appStateContext]);

  const hasChats = groupedChatHistory && groupedChatHistory[0]?.entries?.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {groupedChatHistory && groupedChatHistory.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={groupedChatHistory} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <ThemeToggle />
        <ClearHistory isEnabled={!!hasChats} />
      </div>
    </div>
  )
}