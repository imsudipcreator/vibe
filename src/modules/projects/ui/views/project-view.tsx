"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React, { Suspense, useState } from 'react'
import MessagesContainer from '../components/messages-container'
import { useIsMobile } from '@/hooks/use-mobile'
import { Fragment } from '@/generated/prisma'
import ProjectHeader from '../components/project-header'
import FragmentWeb from '../components/fragment-web'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileExplorer } from '@/components/file-explorer'
import UserControl from '@/components/user-control'
import { useAuth } from '@clerk/nextjs'
import { ErrorBoundary } from 'react-error-boundary'

interface Props {
    projectId: string

}

function ProjectView({ projectId }: Props) {
    const { has } = useAuth()
    const hasProAceess = has?.({ plan: 'pro' })
    const isMobile = useIsMobile()
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
    const [tabState, setTabState] = useState<"preview" | "code">("preview")
    const [mobileTabState, setMobileTabState] = useState<"preview" | "code" | "chat">("chat")


    if (isMobile === undefined) {
        return (
            <p>Loading...</p>
        )
    }



    if (isMobile) {
        return (
            <div className='h-svh flex flex-col'>
                <Suspense fallback={<div>Loading Header...</div>}>
                    <ProjectHeader projectId={projectId} mobileTabState={mobileTabState} setMobileTabState={setMobileTabState} />
                </Suspense>
                <Tabs
                    className='flex flex-col min-h-0 flex-1'
                    value={mobileTabState}
                >
                    <TabsContent value='chat' asChild>
                        <Suspense>
                            <MessagesContainer
                                projectId={projectId}
                                activeFragment={activeFragment}
                                setActiveFragment={setActiveFragment}
                            />
                        </Suspense>
                    </TabsContent>
                    <TabsContent value='preview'>
                        {!!activeFragment && <FragmentWeb data={activeFragment} />}
                    </TabsContent>
                    <TabsContent value='code' className='min-h-0'>
                        {!!activeFragment?.files && (
                            <FileExplorer
                                files={activeFragment.files as { [path: string]: string }}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div >
        )

    }

    return (
        <div className='h-svh'>
            <ResizablePanelGroup direction={'horizontal'}>
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className='min-h-0 flex flex-col'
                >
                    <ErrorBoundary fallback={<p>Project header error</p>}>
                        <Suspense fallback={<div>Loading Header...</div>}>
                            <ProjectHeader projectId={projectId} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<p>Messages error</p>}>
                        <Suspense fallback={<div>Loading Messgaes...</div>}>
                            <MessagesContainer
                                projectId={projectId}
                                activeFragment={activeFragment}
                                setActiveFragment={setActiveFragment}
                            />
                        </Suspense>
                    </ErrorBoundary>
                </ResizablePanel>
                <ResizableHandle className="hover:bg-primary transition-colors" />
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >

                    <Tabs
                        className='h-full gap-y-0'
                        defaultValue='preview'
                        value={tabState}
                        onValueChange={(value) => setTabState(value as "preview" | "code")}
                    >
                        <div className='w-full flex items-center p-2 border-b gap-x-2'>
                            <TabsList>
                                <TabsTrigger value='preview' className='rounded-md'>
                                    <EyeIcon />
                                    <span>Demo</span>
                                </TabsTrigger>
                                <TabsTrigger value='code' className='rounded-md'>
                                    <CodeIcon />
                                    <span>Code</span>
                                </TabsTrigger>
                            </TabsList>
                            <div className='ml-auto flex items-center gap-x-2'>
                                {
                                    !hasProAceess && (
                                        <Button asChild size={'sm'} variant={'tertiary'}>
                                            <Link href={'/pricing'}>
                                                <CrownIcon />Upgrade
                                            </Link>
                                        </Button>
                                    )
                                }

                                <UserControl />
                            </div>
                        </div>
                        <TabsContent value='preview'>
                            {!!activeFragment && <FragmentWeb data={activeFragment} />}
                        </TabsContent>
                        <TabsContent value='code' className='min-h-0'>
                            {!!activeFragment?.files && (
                                <FileExplorer
                                    files={activeFragment.files as { [path: string]: string }}
                                />
                            )}
                        </TabsContent>
                    </Tabs>


                </ResizablePanel>
            </ResizablePanelGroup>


        </div>
    )
}

export default ProjectView
