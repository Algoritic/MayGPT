import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import Contoso from "../assets/logo-icon-white.png";
import Image from 'next/image';


async function UserOrLogin() {
  const session = await auth()
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/" target="_blank" rel="nofollow">
          <Image
            src={Contoso}
            alt="Contoso Logo"
            width={32} // Adjust width as needed
            height={32} // Adjust height as needed
          />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )}
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      {<div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://mpulse.maybanksandbox.com/index.php/638311?lang=en"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          {/* <IconGitHub /> */}
          <span className="hidden ml-2 md:flex">Feedback</span>
        </a>
        <Image
          src={Contoso}
          alt="Contoso Logo"
          width={32} // Adjust width as needed
          height={32} // Adjust height as needed
        />
        {/* <a
          href="https://github.com/vercel/nextjs-ai-chatbot/"
          target="_blank"
          className={cn(buttonVariants())}
        >
          <IconVercel className="mr-2" />
          <span className="hidden sm:block">Deploy to Vercel</span>
          <span className="sm:hidden">Deploy</span>
        </a> */}
      </div>}
    </header>
  )
}
