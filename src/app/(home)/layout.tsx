import Navbar from '@/modules/home/ui/components/navbar'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <main className='min-h-screen max-h-screen flex flex-col'>
            <Navbar/>
            <div className='inset-0 absolute -z-10 bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)]
            bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]
            '/>
            <div className='flex-1 flex flex-col px-4 pb-4'>
                {children}
            </div>
        </main>
    )
}

export default Layout