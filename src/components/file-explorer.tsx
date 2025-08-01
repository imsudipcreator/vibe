/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useCallback, useMemo, useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import Hint from "./hint"
import { Button } from "./ui/button"
import { CopyCheckIcon, CopyIcon, PanelRightIcon } from "lucide-react"
import CodeView from "./code-view"
import { cn, convertFilesToTreeItems } from "@/lib/utils"
import { TreeView } from "./tree-view"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

type FileCollection = { [path: string]: string }

const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension || "text"
}

interface FileBreadcrumbProps {
    filepath: string;
}

const FileBreadcrumb = ({ filepath }: FileBreadcrumbProps) => {
    const isMobile = useIsMobile()
    const pathSegments = filepath.split('/')
    const maxSegments = isMobile ? 2 : 3

    const renderBreadcrumbItems = () => {
        if (pathSegments.length <= maxSegments) {
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1

                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {
                                isLast ? (
                                    <BreadcrumbPage className="font-medium">
                                        {segment}
                                    </BreadcrumbPage>
                                ) : (
                                    <span className="text-muted-foreground">
                                        {segment}
                                    </span>
                                )
                            }
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )
            })
        } else {
            const firstSegment = pathSegments[0]
            const lastSegment = pathSegments[pathSegments.length - 1]

            return (
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">
                            {firstSegment}
                        </span>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )
        }
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadcrumbItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

interface FileExplorerProps {
    files: FileCollection
}

export const FileExplorer = ({
    files
}: FileExplorerProps) => {
    const isMobile = useIsMobile()
    const [copied, setCopied] = useState(false)
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files)
        return fileKeys.length > 0 ? fileKeys[0] : null
    })

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files)
    }, [files])

    const handleSelectFile = useCallback((
        filePath: string
    ) => {
        if (files[filePath]) {
            setSelectedFile(filePath)
        }
    }, [files])


    const handleCopy = useCallback(() => {
        if (selectedFile) {
            try {
                navigator.clipboard.writeText(files[selectedFile])
                setCopied(true)
                toast.success("Code copied to clipboard")
                setTimeout(() => {
                    setCopied(false)
                }, 2000)
            } catch (error : any) {
                toast.error("Code could not be copied", {
                    description : error.message
                })
            }
        }
    }, [selectedFile, files])

    return (
        <Sheet>
            <ResizablePanelGroup direction="horizontal">
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>
                            File Explorer
                        </SheetTitle>
                        <SheetDescription>
                            Click on the files below to view in editor
                        </SheetDescription>
                    </SheetHeader>
                    <TreeView
                        data={treeData}
                        value={selectedFile}
                        onSelect={handleSelectFile}
                    />
                </SheetContent>

                <ResizablePanel defaultSize={30} minSize={30} className={cn("bg-sidebar",
                    isMobile && 'hidden'
                )}>
                    <TreeView
                        data={treeData}
                        value={selectedFile}
                        onSelect={handleSelectFile}
                    />
                </ResizablePanel>
                <ResizableHandle className="hover:bg-primary transition-colors" />
                <ResizablePanel defaultSize={70} minSize={50}>
                    {selectedFile && files[selectedFile] ? (
                        <div className="flex flex-col w-full h-full">
                            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center">
                                <FileBreadcrumb filepath={selectedFile} />
                                {isMobile && (
                                    <Hint text="Toggle explorer" align="end" side="left">
                                        <SheetTrigger asChild>
                                            <Button variant={'outline'} size={'icon'} className="mr-3 ml-auto">
                                                <PanelRightIcon />
                                            </Button>
                                        </SheetTrigger>
                                    </Hint>
                                )}
                                <Hint text="Copy to clipboard" align="end" side="left">
                                    <Button
                                        variant={'outline'}
                                        size={'icon'}
                                        onClick={handleCopy}
                                        disabled={copied}
                                    >
                                        {copied ? <CopyCheckIcon /> : <CopyIcon />}
                                    </Button>
                                </Hint>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <CodeView
                                    code={files[selectedFile]}
                                    lang={getLanguageFromExtension(selectedFile)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            select a file to view its contents
                        </div>
                    )
                    }
                </ResizablePanel>
            </ResizablePanelGroup>
        </Sheet>

    )
}