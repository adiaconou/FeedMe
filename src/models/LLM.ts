export interface LLMRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  id: string;
  model: string;
  created: number;
  choices: Choice[];
  usage: Usage;
}

interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    input: number;
    output: number;
  };
} 