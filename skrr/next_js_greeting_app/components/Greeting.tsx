// No need to import React when using the new JSX transform (default in Next.js).

/**
 * A reusable component that renders a greeting.
 * This uses a function declaration for consistency and clear naming in React DevTools.
 */
export function Greeting(): JSX.Element {
  // "안녕" (Annyeong) is a common Korean greeting, similar to "Hello".
  return <h1>안녕</h1>;
}
