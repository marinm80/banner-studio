// Layout decisions that CSS alone cannot make — such as whether the side
// panels are docked or live in a drawer — need the breakpoint in JS too.

import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// Matches Tailwind's `xl` breakpoint. Below it the two 288px sidebars would
// leave the canvas too narrow to design in, so the panels move to drawers and
// the banner gets the full width instead.
export const DOCKED_PANELS = '(min-width: 1280px)';
