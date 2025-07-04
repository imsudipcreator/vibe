"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React, { Suspense } from 'react'
import MessagesContainer from '../components/messages-container'

interface Props {
    projectId: string
}

function ProjectView({ projectId }: Props) {

    return (
        <div className='h-screen'>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className='min-h-0 flex flex-col'
                >
                    <Suspense fallback={<div>Loading Messgaes...</div>}>
                        <MessagesContainer projectId={projectId} />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    To-do : preview
                </ResizablePanel>
            </ResizablePanelGroup>


        </div>
    )
}

export default ProjectView
