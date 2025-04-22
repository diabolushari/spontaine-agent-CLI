import { ChatMessage } from '@/Chat/components/MainArea'

export interface AgentAction {
  tool: string
  tool_input: string
  log: string
}

export interface AgentActionsResponse {
  actions: AgentAction[]
}

export interface AgentOutputResponse {
  output: string
}

// Union type for any possible agent response
export type AgentResponse = AgentActionsResponse | AgentOutputResponse

/**
 * Converts an agent response (actions or output) to a ChatMessage with type 'bot' and content as text.
 * If the response is actions, concatenates all logs as message content.
 * If the response is output, uses the output string as content.
 */
export function agentResponseToChatMessages(
  response: AgentResponse,
  nextId: number
): ChatMessage[] {
  if ('actions' in response) {
    // Concatenate all logs from actions as one message
    const logs = response.actions.map((a) => a.log).join('\n')
    return [
      {
        id: nextId,
        type: 'bot',
        content: logs,
        contentType: 'text',
        suggestions: [],
      },
    ]
  }

  if ('output' in response) {
    return [
      {
        id: nextId,
        type: 'bot',
        content: response.output,
        contentType: 'text',
        suggestions: [],
      },
    ]
  }

  // Fallback: should not happen if types are correct
  return []
}

/**
 * Parses a string response from the agent and converts it to a ChatMessage[].
 * If parsing fails, returns a fallback error message.
 */
export function parseAndConvertAgentResponse(
  responseString: string,
  nextId: number
): ChatMessage[] {
  try {
    const json = JSON.parse(responseString) as AgentResponse
    return agentResponseToChatMessages(json, nextId)
  } catch (e) {
    console.log(e)
    return [
      {
        id: nextId,
        type: 'bot',
        content: '❌ Agent response could not be parsed.',
        contentType: 'text',
        suggestions: [],
      },
    ]
  }
}
