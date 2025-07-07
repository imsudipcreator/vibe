import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTRPC } from '@/trpc/client'
import { useAuth } from '@clerk/nextjs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronDownIcon, ChevronLeftIcon, CodeIcon, CrownIcon, EyeIcon, InfoIcon, MessageSquareCodeIcon, SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
    projectId: string
    mobileTabState?: "preview" | "code" | "chat"
    setMobileTabState?: React.Dispatch<React.SetStateAction<"preview" | "code" | "chat">>
}

const ProjectHeader = ({ projectId, mobileTabState, setMobileTabState }: Props) => {
    const { has } = useAuth()
    const hasProAceess = has?.({ plan: 'pro' })
    const isMobile = useIsMobile()
    const trpc = useTRPC()
    const { setTheme, theme } = useTheme()
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))


    return (
        <Dialog>
            <header className='p-2 flex justify-between items-center border-b'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!'
                        >
                            <Image
                                src={'/vibe.svg'}
                                alt='vibe'
                                height={18}
                                width={18}
                                className='shrink-0'
                            />
                            <span>{project.name}</span>
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start'>
                        <DropdownMenuItem asChild>
                            <Link href={'/'}>
                                <ChevronLeftIcon />
                                <span>Go to Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='gap-2'>
                                <SunMoonIcon className='size-4 text-muted-foreground' />
                                <span>Appearance</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                        <DropdownMenuRadioItem value='light'>
                                            <span>Light</span>
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value='dark'>
                                            <span>Dark</span>
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value='system'>
                                            <span>System</span>
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DialogTrigger asChild>
                            <DropdownMenuItem asChild>
                                <button className='w-full'>
                                    <InfoIcon />
                                    <span>More info</span>
                                </button>
                            </DropdownMenuItem>
                        </DialogTrigger>

                    </DropdownMenuContent>
                </DropdownMenu>

                <DialogContent className='w-full'>
                    <DialogHeader>
                        <DialogTitle>
                            Info
                        </DialogTitle>
                        <DialogDescription>
                            Additonal information about vibe
                        </DialogDescription>
                    </DialogHeader>

                    <p className='text-sm text-secondary-foreground'>
                        {` This AI assistant is powered by Imago Intelligence, a product of Imago. 
                       It helps you generate websites and code using advanced AI models. 
                       The AI may occasionally make mistakes or misinterpret your request. 
                       If that happens, try describing the issue more clearly or mention any error you received, then regenerate the response. 
                       We're continuously working to improve the experience. Thank you for using Vibe.`}
                    </p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'outline'}>
                                Close
                            </Button>
                        </DialogClose>
                        <Button>
                            <Link href={'https://imagollc.vercel.app'} target='_blank'>
                            Visit imago
                            </Link>
                        </Button>
                    </DialogFooter>

                </DialogContent>

                <div className='flex items-center gap-3'>
                    {
                        isMobile && mobileTabState && setMobileTabState && (
                            <Tabs
                                defaultValue='chat'
                                value={mobileTabState}
                                onValueChange={(value) => setMobileTabState(value as "preview" | "code" | "chat")}
                            >
                                <TabsList>
                                    <TabsTrigger value='preview' className='rounded-md'>
                                        <EyeIcon />
                                    </TabsTrigger>
                                    <TabsTrigger value='code' className='rounded-md'>
                                        <CodeIcon />
                                    </TabsTrigger>
                                    <TabsTrigger value='chat' className='rounded-md'>
                                        <MessageSquareCodeIcon />
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )
                    }


                    {
                        isMobile && hasProAceess && (
                            <Button asChild variant={'tertiary'}>
                                <Link href={'/pricing'}>
                                    <CrownIcon />
                                </Link>
                            </Button>
                        )
                    }
                </div>



            </header>
        </Dialog>

    )
}

export default ProjectHeader