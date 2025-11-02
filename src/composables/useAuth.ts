import { computed, ref } from "vue";

// Estado global de autenticación
const authToken = ref<string | null>(null);
const userEmail = ref<string | null>(null);

export function useAuth() {
  // Verificar si hay token en localStorage
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");

    authToken.value = token;
    userEmail.value = email;

    return !!token;
  };

  // Estado de autenticación
  const isAuthenticated = computed(() => !!authToken.value);

  // Login
  const login = (token: string, email: string) => {
    authToken.value = token;
    userEmail.value = email;

    localStorage.setItem("authToken", token);
    localStorage.setItem("userEmail", email);
  };

  // Logout
  const logout = () => {
    authToken.value = null;
    userEmail.value = null;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");
  };

  // Obtener datos del usuario
  const getUser = () => {
    return {
      email: userEmail.value,
      token: authToken.value,
    };
  };

  return {
    isAuthenticated,
    checkAuth,
    login,
    logout,
    getUser,
  };
}
