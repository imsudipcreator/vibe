import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

/**
 * Connects to a sandbox environment using the provided sandbox ID.
 *
 * @param sandboxId - The unique identifier of the sandbox to connect to
 * @returns A promise that resolves to the connected sandbox instance
 */
export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

/**
 * Returns the content of the last assistant text message from an agent result.
 *
 * If the last assistant message's content is an array, concatenates its text fields into a single string. Returns `undefined` if no assistant message or content is found.
 *
 * @param result - The agent result containing output messages
 * @returns The content of the last assistant text message, or `undefined` if not found
 */
export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}

export const parseAgentOutput = (value: Message[]): string | null => {
  const output = value[0];
  if (output.type !== "text") {
    return null;
  }

  if (Array.isArray(output.content)) {
    return output.content.map((txt) => txt).join("");
  } else {
    return output.content;
  }
};
