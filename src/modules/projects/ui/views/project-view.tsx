"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React, { Suspense, useState } from 'react'
import MessagesContainer from '../components/messages-container'
import { useIsMobile } from '@/hooks/use-mobile'
import { Fragment } from '@/generated/prisma'
import ProjectHeader from '../components/project-header'
import FragmentWeb from '../components/fragment-web'

interface Props {
    projectId: string

}

function ProjectView({ projectId }: Props) {
    const isMobile = useIsMobile()
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)

    return (
        <div className='h-screen'>
            <ResizablePanelGroup direction={isMobile ? 'vertical' : 'horizontal'}>
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className='min-h-0 flex flex-col'
                >
                    <Suspense fallback={<div>Loading Header...</div>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={<div>Loading Messgaes...</div>}>
                        <MessagesContainer
                            projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    { !!activeFragment && <FragmentWeb data={activeFragment}/>}
                </ResizablePanel>
            </ResizablePanelGroup>


        </div>
    )
}

export default ProjectView
