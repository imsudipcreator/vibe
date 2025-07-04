'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter()
  const [value, setvalue] = useState("")
  const trpc = useTRPC()
  // const { data: messages } = useQuery(trpc.messages.getMany.queryOptions())
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => toast.error(error.message),
    onSuccess : (data) => {
      router.push(`/projects/${data.id}`)
    }
  }))

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl flex flex-col items-center justify-center gap-y-3.5">
        <Input value={value} onChange={(e) => setvalue(e.target.value)} className="w-48" />
        <Button disabled={createProject.isPending} onClick={() => createProject.mutate({ value: value })}>
          Submit
        </Button>
      </div>
    </div>
  );
}
