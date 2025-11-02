import "@fortawesome/fontawesome-free/css/all.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { useAuthStore } from "./stores/auth.store";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

// Configurar plugins
app.use(pinia);
app.use(i18n);
app.use(router);

// Inicializar autenticación antes de montar la app
const authStore = useAuthStore();
authStore.initAuth().then(() => {
  app.mount("#app");
});
