export type Prompt = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type PromptFormData = Omit<Prompt, 'id' | 'created_at' | 'updated_at'>;

export type PromptWithId = Omit<Prompt, 'created_at' | 'updated_at'>;
