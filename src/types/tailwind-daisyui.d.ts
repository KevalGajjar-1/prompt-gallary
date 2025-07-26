import 'tailwindcss';

declare module 'tailwindcss' {
  interface PluginAPI {
    addBase: (styles: Record<string, unknown>) => void;
    addComponents: (components: Record<string, unknown>, options?: { variants?: string[] }) => void;
    addUtilities: (utilities: Record<string, unknown>, options?: { variants?: string[] }) => void;
    config: (path?: string) => unknown;
    theme: <TDefaultValue = Config['theme']>(
      path?: string,
      defaultValue?: TDefaultValue
    ) => TDefaultValue;
    variants: (path?: string, defaultValue?: string[]) => string[];
    e: (className: string) => string;
  }

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

declare module 'daisyui' {
  const plugin: (options?: {
    themes?: boolean | string[];
    darkTheme?: string;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    prefix?: string;
    logs?: boolean;
  }) => (api: import('tailwindcss').PluginAPI) => void;
  
  export default plugin;
}
