import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
  Tool,
  // openai,
} from "@inngest/agent-kit";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "@/prompt";
import prisma from "@/lib/db";

interface AgentState {
  summary : string
  files : {[path : string] : string}
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-imagollc");

      return sandbox.sandboxId;
    });

    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      system: PROMPT,
      description: "An expert coding agent",
      model: gemini({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      // model: openai({
      //   model: "gemma2-9b-it",
      //   apiKey: process.env.GROQ_API_KEY,
      //   baseUrl: "https://api.groq.com/openai/v1",
      //   defaultParameters : {
      //     temperature : 0.1
      //   }
      // }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use this terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          // handler: async ({ command }, { step }) => {
          //   console.log("🖥️ Terminal command:", command);
          //   return await step?.run("terminal", async () => {
          //     const buffers = { stdout: "", stderr: "" };

          //     try {
          //       const sandbox = await getSandbox(sandboxId);
          //       const result = await sandbox.commands.run(command, {
          //         onStdout: (data: string) => {
          //           buffers.stdout += data;
          //         },
          //         onStderr: (data: string) => {
          //           buffers.stderr += data;
          //         },
          //       });
          //       console.log("✅ Terminal result:", result.stdout);
          //       return result.stdout;
          //     } catch (e) {
          //       console.error("❌ Terminal failed:", e, buffers);
          //       console.error(
          //         `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
          //       );

          //       return `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
          //     }
          //   });
          // },

          handler: async ({ command }) => {
            // console.log("🖥️ Terminal command:", command);
            const buffers = { stdout: "", stderr: "" };

            try {
              const sandbox = await getSandbox(sandboxId);
              const result = await sandbox.commands.run(command, {
                onStdout: (data: string) => {
                  buffers.stdout += data;
                },
                onStderr: (data: string) => {
                  buffers.stderr += data;
                },
              });

              // console.log("✅ Terminal result:", result.stdout);
              return result.stdout;
            } catch (e) {
              console.error("❌ Terminal failed:", e, buffers);
              const message = `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              console.error(message);
              return message;
            }
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          // handler: async ({ files }, { step, network }) => {
          //   console.log("📄 Files to write:", files);
          //   const newFiles = await step?.run(
          //     "createOrUpdateFiles",
          //     async () => {
          //       console.log("🚀 Entered step.run block"); // Debug checkpoint #1
          //       try {
          //         const updatedFiles = network.state.data.files || {};
          //         const sandbox = await getSandbox(sandboxId);

          //         console.log("🧱 Sandbox acquired:", !!sandbox); // Debug checkpoint #2
          //         for (const file of files) {
          //           console.log(`📝 Writing file: ${file.path}`); // Debug checkpoint #3
          //           await sandbox.files.write(file.path, file.content);
          //           updatedFiles[file.path] = file.content;
          //         }
          //         console.log("✅ Files written:", updatedFiles);
          //         return updatedFiles;
          //       } catch (e) {
          //         console.error("❌ File write failed:", e);
          //         return `Error : ${e}`;
          //       }
          //     }
          //   );

          //   if (typeof newFiles === "object") {
          //     network.state.data.files = newFiles;
          //     console.log('network.state.data.files', network.state.data.files)
          //   }
          // },
          handler: async ({ files }, { network } : Tool.Options<AgentState>) => {
            // console.log("📄 Files to write:", files);

            try {
              const updatedFiles = network.state.data.files || {};
              const sandbox = await getSandbox(sandboxId);
              // console.log("🧱 Sandbox acquired:", !!sandbox);

              for (const file of files) {
                // console.log(`📝 Writing file: ${file.path}`);
                await sandbox.files.write(file.path, file.content);
                updatedFiles[file.path] = file.content;
              }

              // console.log("✅ Files written:", updatedFiles);
              network.state.data.files = updatedFiles;
            } catch (e) {
              console.error("❌ File write failed:", e);
              throw e;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          // handler: async ({ files }, { step }) => {
          //   return await step?.run("readFiles", async () => {
          //     try {
          //       const sandbox = await getSandbox(sandboxId);
          //       const contents = [];

          //       for (const file of files) {
          //         const content = await sandbox.files.read(file);
          //         contents.push({ path: file, content });
          //       }
          //       console.log("📖 Files read:", contents);
          //       return JSON.stringify(contents);
          //     } catch (e) {
          //       console.error("❌ File read failed:", e);
          //       return "Error: " + e;
          //     }
          //   });
          // },
          handler: async ({ files }) => {
            try {
              const sandbox = await getSandbox(sandboxId);
              const contents: { path: string; content: string }[] = [];

              for (const file of files) {
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }

              // console.log("📖 Files read:", contents);
              return JSON.stringify(contents);
            } catch (e) {
              console.error("❌ File read failed:", e);
              return "Error: " + e;
            }
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          // console.log("🧠 Agent responded with:", lastAssistantMessageText);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) return;

        return codeAgent;
      },
    });

    // console.log(event.data.value)

    console.log("📡 Running network...");
    const result = await step.run("run-network", async () => {
      return await network.run(event.data.value);
    });

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    // await step.run("verify-created-files", async () => {
    //   const sandbox = await getSandbox(sandboxId);

    //   const writtenFiles = Object.keys(network.state.data.files || {});
    //   if (!writtenFiles.length) {
    //     console.warn("⚠️ No files found in network state.");
    //     return;
    //   }

    //   for (const path of writtenFiles) {
    //     const exists = await sandbox.files.exists(path);
    //     if (!exists) {
    //       console.warn(`❌ File missing in sandbox: ${path}`);
    //     } else {
    //       console.log(`✅ File exists in sandbox: ${path}`);
    //     }
    //   }
    // });

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            content: "Something went wrong. Please try again.",
            role: "ASSISTANT",
            type: "ERROR"
          },
        });
      }
      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl,
              title: "Fragment",
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
