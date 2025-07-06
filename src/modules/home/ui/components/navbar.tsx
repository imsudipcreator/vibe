'use client'

import { Button } from '@/components/ui/button'
import UserControl from '@/components/user-control'
import { useScroll } from '@/hooks/use-scroll'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const isScrolled = useScroll()
    const pathname = usePathname()
    return (
        <nav className={cn(
            "bg-transparent border-b border-transparent p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-200",
            isScrolled && 'bg-background border-border',
            pathname === '/pricing' && 'z-0'
        )}>
            <div className='max-w-5xl mx-auto w-full flex justify-between items-center'>
                <Link href={'/'} className='flex items-center gap-2'>
                    <Image
                        src={'/vibe.svg'}
                        alt='vibe'
                        width={24}
                        height={24}
                    />
                    <span className='font-semibold text-lg'>Vibe</span>

                </Link>

                <SignedOut>
                    <div className='flex gap-2'>
                        <SignUpButton>
                            <Button variant={'outline'} size={'sm'}>
                                Sign up
                            </Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button  size={'sm'}>
                                Sign in
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserControl showName/>
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar