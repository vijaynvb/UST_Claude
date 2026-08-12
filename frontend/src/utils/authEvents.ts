type ForcedLogoutListener = () => void;

const listeners = new Set<ForcedLogoutListener>();

export const authEvents = {
  onForcedLogout(listener: ForcedLogoutListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  emitForcedLogout(): void {
    listeners.forEach((listener) => listener());
  },
};
