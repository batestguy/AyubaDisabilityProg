import { useEffect, useState } from 'react';
/** One preference shared by autoplay, observers, parallax and CSS decorations. */
export function useReducedMotion(requested: boolean) {
 const [system, setSystem] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setSystem(query.matches);
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
 }, []);
 return requested || system;
}
