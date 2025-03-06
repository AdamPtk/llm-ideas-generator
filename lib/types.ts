export interface Idea {
  id: string;
  name: string;
  userId: string;
  prompt: string;
  html: string;
  model: string;
  createdAt: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}
