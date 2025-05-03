import * as PrismNamespace from 'prismjs';

declare global {
  interface Window {
    Prism: typeof PrismNamespace;
  }
}

export {};