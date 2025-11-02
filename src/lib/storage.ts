// Almacenamiento condicional para Supabase Auth
// Usa localStorage si está disponible, si no, fallback a memoria

class MemoryStorage {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

export const conditionalStorage = ((): Storage => {
  try {
    const testKey = "__test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    return new MemoryStorage() as unknown as Storage;
  }
})();
