import 'tailwindcss';

declare module 'tailwindcss' {
  interface PluginAPI {
    addBase: (styles: Record<string, any>) => void;
    addComponents: (components: Record<string, any>, options?: { variants?: string[] }) => void;
    addUtilities: (utilities: Record<string, any>, options?: { variants?: string[] }) => void;
    config: (path?: string) => any;
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
  }) => (api: any) => void;
  
  export default plugin;
}
