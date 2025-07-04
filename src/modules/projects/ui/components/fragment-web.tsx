import Hint from '@/components/hint'
import { Button } from '@/components/ui/button'
import { Fragment } from '@/generated/prisma'
import { ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
    data: Fragment
}

const FragmentWeb = ({ data }: Props) => {
    const [copied, setCopied] = useState(false)
    const [fragmentKey, setFragmentKey] = useState(0)

    const onRefresh = () => {
        setFragmentKey(prev => prev + 1)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className='w-full h-full flex flex-col'>
            <div className='p-2 border-b bg-sidebar flex items-center gap-x-2'>
                <Hint text='Refresh' align='start' side='bottom'>
                    <Button size={'sm'} variant={'outline'} onClick={onRefresh}>
                        <RefreshCcwIcon />
                    </Button>
                </Hint>
                <Hint text='Click to copy' align='center' side='bottom'>
                    <Button
                        size={'sm'}
                        variant={'outline'}
                        onClick={handleCopy}
                        disabled={!data.sandboxUrl || copied}
                        className='flex-1 justify-start text-start font-normal'
                    >
                        <span className='truncate'>{data.sandboxUrl}</span>
                    </Button>
                </Hint>

                <Hint text='Open in a new tab' align='end' side='bottom'>
                    <Button
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => {
                            if (!data.sandboxUrl) return
                            window.open(data.sandboxUrl, '_blank')
                        }}
                        disabled={!data.sandboxUrl}
                    >
                        <ExternalLinkIcon />
                    </Button>
                </Hint>
            </div>
            <iframe
                key={fragmentKey}
                className='w-full h-full'
                sandbox='allow-forms allow-same-origin allow-scripts'
                loading='lazy'
                src={data.sandboxUrl}
            />
        </div>
    )
}

export default FragmentWeb