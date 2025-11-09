// Declaração temporária até @types/react ser instalado
// Execute: npm install --save-dev @types/react @types/react-dom

declare module 'react' {
  export namespace React {
    export interface FormEvent<T = Element> {
      preventDefault(): void;
      currentTarget: T;
    }
  }

  export interface FormEvent<T = Element> extends React.FormEvent<T> {}

  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  
  export default any;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function Fragment(props: { children?: any }): any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element extends any {}
  }

  namespace React {
    interface FormEvent<T = Element> {
      preventDefault(): void;
      currentTarget: T;
    }
  }
}

