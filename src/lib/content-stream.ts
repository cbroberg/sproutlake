/**
 * In-memory SSE broadcast for live content updates.
 * When the revalidate webhook fires, it notifies all connected browsers
 * so they can refresh without manual reload.
 */

type Listener = (paths: string[]) => void;

const listeners = new Set<Listener>();

export function addListener(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notifyContentChange(paths: string[]) {
  for (const fn of listeners) {
    fn(paths);
  }
}
