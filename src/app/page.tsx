'use client'

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC()
  const invoke  = useMutation(trpc.invoke.mutationOptions({
    onSuccess : () => toast.success("Background job started")
  }))
  
  return (
    <div className="p-4 min-w-7xl">
      <Button disabled={invoke.isPending} onClick={() => invoke.mutate({ text : "Sudip"})}>
        invoke background job
      </Button>
    </div>
  );
}
