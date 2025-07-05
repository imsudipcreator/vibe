import { TreeItem } from '@/types'
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarRail } from './ui/sidebar'
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

interface TreeViewProps {
    data: TreeItem[]
    value?: string | null
    onSelect?: (value: string) => void
}

export const TreeView = ({
    data,
    onSelect,
    value
}: TreeViewProps) => {
    return (
        <SidebarProvider>
            <Sidebar collapsible='none' className='w-full'>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    data.map((item, index) => (
                                        <Tree
                                            key={ index}
                                            item={item}
                                            onSelect={onSelect}
                                            selectedValue={value}
                                            parentPath=''
                                        />
                                    ))
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail/>
            </Sidebar>
        </SidebarProvider>
    )
}


interface TreeProps {
    item: TreeItem
    selectedValue?: string | null
    onSelect? : (value: string) => void
    parentPath: string
}

const Tree = ({
    item, onSelect, parentPath, selectedValue
}: TreeProps) => {
    const [name, ...items] = Array.isArray(item) ? item : [item]
    const currentPath = parentPath ? `${parentPath}/${name}` : name

    if (!items.length) {
        // it's a file
        const isSelected = selectedValue === currentPath
        return (
            <SidebarMenuButton
                isActive={isSelected}
                className='data-[active=true]:bg-transparent'
                onClick={() => onSelect?.(currentPath)}
            >
                <FileIcon />
                <span className='truncate'>{name}</span>
            </SidebarMenuButton>
        )
    }


    return (
        <SidebarMenuItem>
            <Collapsible
                className='group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90'
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRightIcon className='transition-transform' />
                        <FolderIcon />
                        <span className='truncate'>
                            {name}
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree
                                item={subItem}
                                key={index}
                                selectedValue={selectedValue}
                                onSelect={onSelect}
                                parentPath={currentPath}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )

}