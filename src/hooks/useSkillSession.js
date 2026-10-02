import { useEffect, useRef } from 'react';
import { recordSkillSession } from '@/utils/skillProgress.js';

export function useSkillSession(completed, { activity, correct, total, score, mistakes }) {
  const attempt = useRef(null);
  useEffect(() => {
    if (!completed) { attempt.current = null; return; }
    if (!attempt.current) attempt.current = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, at: Date.now() };
    recordSkillSession({ activity, correct, total, score, mistakes, id: `${attempt.current.id}-${activity}`, at: attempt.current.at });
  }, [completed, activity, correct, total, score, mistakes]);
}
