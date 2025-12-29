import { useState, useEffect } from 'react';

const SESSION_ID_KEY = 'cofinder_session_id';

function generateSessionId(): string {
  return 'sess_' + crypto.randomUUID();
}

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}
