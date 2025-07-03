import { inngest } from "./client";
import { Sandbox } from '@e2b/code-interpreter'
import { openai, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-imagollc")

      return sandbox.sandboxId
    })


    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert Next.js developer. You write readable, maintainable code. You write simple Next.js and React snippets",
      model: openai({
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: "https://api.groq.com/openai/v1",
      }),
    });


    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`
    );


    const sandboxUrl = await step.run("get-sandbox-url", async ()=>{
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)

      return `https://${host}`
    })
    return { output, sandboxUrl };
  }
);
