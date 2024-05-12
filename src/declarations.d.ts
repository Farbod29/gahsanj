// src/declarations.d.ts
declare module 'use-react-screenshot' {
  export function useScreenshot(
    options?: any
  ): [any, (node: HTMLElement) => Promise<any>];
  export function createFileName(extension: string, prefix?: string): string;
}
