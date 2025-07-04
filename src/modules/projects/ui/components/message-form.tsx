import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
    projectId: string
}


const formSchema = z.object({
    value: z
        .string()
        .min(1, { message: "Value is required" })
        .max(10000, { message: "Value is too long" })
})

const MessageForm = ({ projectId }: Props) => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: ""
        }
    })


    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: () => {
            form.reset()
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({ projectId })
            )
            // Invalidate usage
        },

        onError: (error) => {
            toast.error(error.message)
        }
    }))
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId
        })
    }

    const [isFocused, setIsFocused] = useState(false)
    const isPending = createMessage.isPending
    const isButtonDisabled = isPending || !form.formState.isValid
    const showUsage = false

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    'relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all',
                    isFocused && 'shadow-xs',
                    showUsage && 'rounded-t-none'
                )}
            >
                <FormField
                    control={form.control}
                    name='value'
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows={2}
                            maxRows={8}
                            className='pt-4 resize-none border-none outline-none w-full bg-transparent'
                            placeholder='What would you like to build?'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault()
                                    form.handleSubmit(onSubmit)(e)
                                }
                            }}
                        />
                    )}
                />

                <div className='flex gap-x-2 items-end justify-between pt-2'>
                    <div className='text-muted-foreground font-mono text-[10px]'>
                        <kbd className='ml-auto pointer-events-none inline-flex h-5 items-center justify-center gap-1 rounded border
                        bg-muted px-1.5 font-medium
                        '>
                            <span>&#8984;</span>Enter
                        </kbd>
                        &nbsp;to build
                    </div>
                    <Button
                        disabled={isButtonDisabled}
                        className={cn(
                            'size-8 rounded-full flex items-center justify-center'
                        )}>
                        {
                            isPending ? (
                                <Loader2Icon className='animate-spin size-4' />
                            ) : (
                                <ArrowUpIcon />
                            )
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default MessageForm