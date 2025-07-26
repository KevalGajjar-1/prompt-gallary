declare module 'daisyui' {
  import { Plugin } from 'tailwindcss/types/config';

  interface DaisyUIPlugin extends Plugin {
    (options?: {
      themes?: string[] | boolean;
      darkTheme?: string;
      base?: boolean;
      styled?: boolean;
      utils?: boolean;
      prefix?: string;
      logs?: boolean;
    }): Plugin;
  }

  const daisyui: DaisyUIPlugin;
  export default daisyui;
}

declare module 'tailwindcss/types/config' {
  interface Config {
    daisyui?: {
      themes?: string[] | boolean;
      darkTheme?: string;
      base?: boolean;
      styled?: boolean;
      utils?: boolean;
      prefix?: string;
      logs?: boolean;
    };
  }
}
