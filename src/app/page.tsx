'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [value, setvalue] = useState("")
  const trpc = useTRPC()
  const { data : messages} = useQuery(trpc.messages.getMany.queryOptions())
  const createMessage  = useMutation(trpc.messages.create.mutationOptions({
    onSuccess : () => toast.success("Background job started")
  }))
  
  return (
    <div className="p-4 min-w-7xl space-y-4">
      <Input value={value} onChange={(e) => setvalue(e.target.value)} className="w-48"/>
      <Button disabled={createMessage.isPending} onClick={() => createMessage.mutate({ value : value})}>
        invoke background job
      </Button>
      {
        JSON.stringify(messages, null, 2)
      }
    </div>
  );
}
