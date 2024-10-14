'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'

import { IconSidebar } from '@/components/ui/icons'
import { useContext } from 'react'
import { AppStateContext } from '@/lib/AppProvider'

interface SidebarMobileProps {
  children: React.ReactNode
}

export function SidebarMobile({ children }: SidebarMobileProps) {
  const appStateContext = useContext(AppStateContext)

  const handleHistoryClick = () => {
    console.log('reached here 11')
    appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 flex size-9 p-0 lg:hidden" onClick={handleHistoryClick}>
          <IconSidebar className="size-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  )
}
