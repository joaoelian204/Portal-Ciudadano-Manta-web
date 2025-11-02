import { ref } from "vue";

export function useSearch() {
  const searchTerm = ref("");

  const performSearch = () => {
    if (searchTerm.value.trim()) {
      console.log("Buscando:", searchTerm.value);
      // Aquí puedes implementar la lógica de búsqueda
      // Por ejemplo, navegar a una página de resultados:
      // router.push({ name: 'search-results', query: { q: searchTerm.value } });
    }
  };

  const clearSearch = () => {
    searchTerm.value = "";
  };

  return {
    searchTerm,
    performSearch,
    clearSearch,
  };
}
