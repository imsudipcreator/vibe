import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronDownIcon, ChevronLeftIcon, CodeIcon, EyeIcon, MessageSquareCodeIcon, SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
    projectId: string
    mobileTabState? : "preview" | "code" | "chat"
    setMobileTabState? : React.Dispatch<React.SetStateAction<"preview" | "code" | "chat">>
}

const ProjectHeader = ({ projectId, mobileTabState, setMobileTabState }: Props) => {
    const isMobile = useIsMobile()
    const trpc = useTRPC()
    const { setTheme, theme } = useTheme()
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))


    return (
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
                </DropdownMenuContent>
            </DropdownMenu>


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
        </header>
    )
}

export default ProjectHeader