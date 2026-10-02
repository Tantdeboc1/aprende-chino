import { useState, useCallback } from 'react';

// Session-only review: no answers from previous attempts and no storage changes.
export function useMistakeReview() {
  const [mistakes, setMistakes] = useState([]);
  const recordMistake = useCallback((item) => setMistakes(prev => [...prev, item]), []);
  const clearMistakes = useCallback(() => setMistakes([]), []);
  return { mistakes, recordMistake, clearMistakes };
}
