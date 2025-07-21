import { ReactElement } from 'react';

declare global {
  namespace JSX {
    type Element = ReactElement
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export {};
