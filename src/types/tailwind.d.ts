import 'tailwindcss/types/config';

declare module 'tailwindcss/types/config' {
  interface PluginAPI {
    daisyui: {
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
