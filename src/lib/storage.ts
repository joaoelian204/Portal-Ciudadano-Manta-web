/**
 * Almacenamiento personalizado para Supabase que permite cambiar
 * entre localStorage (persistente) y sessionStorage (temporal)
 */

class ConditionalStorage {
  private useLocalStorage: boolean = true;

  /**
   * Configura si se debe usar localStorage (permanente) o sessionStorage (temporal)
   * @param usePersistent - true para localStorage, false para sessionStorage
   */
  setPersistence(usePersistent: boolean) {
    this.useLocalStorage = usePersistent;
  }

  private getStorage(): Storage {
    return this.useLocalStorage ? window.localStorage : window.sessionStorage;
  }

  getItem(key: string): string | null {
    // Intentar buscar en ambos storages para recuperar sesiones existentes
    return (
      window.localStorage.getItem(key) || window.sessionStorage.getItem(key)
    );
  }

  setItem(key: string, value: string): void {
    const storage = this.getStorage();
    storage.setItem(key, value);

    // Si cambiamos a sessionStorage, limpiar localStorage
    if (!this.useLocalStorage) {
      window.localStorage.removeItem(key);
    }
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }
}

export const conditionalStorage = new ConditionalStorage();
