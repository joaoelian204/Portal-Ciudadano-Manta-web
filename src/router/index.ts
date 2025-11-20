import Dashboard from "@/views/Dashboard.vue";
import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import Home from "../views/Home.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("../views/ResetPassword.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/sobre-nosotros",
    name: "SobreNosotros",
    component: () => import("../views/SobreNosotros.vue"),
    meta: { requiresAuth: false },
  },
  // Rutas protegidas (requieren autenticación)
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/reportar-problema",
    name: "ReportarProblema",
    component: () => import("../views/ReportarProblema.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/mi-perfil",
    name: "MiPerfil",
    component: () => import("../views/MiPerfil.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/encuestas",
    name: "Encuestas",
    component: () => import("../views/Encuestas.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/encuestas/:id",
    name: "EncuestaDetalle",
    component: () => import("../views/EncuestaDetalle.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/noticias",
    name: "Noticias",
    component: () => import("../views/Noticias.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/noticias/:id",
    name: "NoticiaDetalle",
    component: () => import("../views/NoticiaDetalle.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: () => import("../views/AdminPanel.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/admin/noticias",
    name: "AdminNoticias",
    component: () => import("../views/AdminNoticias.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/encuestas",
    name: "AdminEncuestas",
    component: () => import("../views/AdminEncuestas.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/reportes",
    name: "AdminReportes",
    component: () => import("../views/AdminReportes.vue"),
    meta: { requiresAuth: true },
  },
  // Ruta catch-all para 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: { name: "Home" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Guard de navegación con Supabase
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  console.log("🛣️ Router Guard INICIO:", {
    from: from.path,
    to: to.path,
    loading: authStore.loading,
  });

  // Esperar a que loading termine antes de continuar
  if (authStore.loading) {
    console.log(
      "⏳ Router: Esperando a que termine la inicialización de auth..."
    );
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("⚠️ Router: Timeout esperando loading");
        resolve();
      }, 5000);

      const stop = watch(
        () => authStore.loading,
        (loading) => {
          if (!loading) {
            clearTimeout(timeout);
            stop();
            resolve();
          }
        }
      );
    });
  }

  // Si hay user pero no hay usuario (datos de perfil), esperar un poco más
  if (authStore.user && !authStore.usuario && !authStore.loading) {
    console.log("⏳ Router: Esperando a que se cargue el perfil de usuario...");
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("⚠️ Router: Timeout esperando perfil de usuario");
        resolve();
      }, 3000);

      const stop = watch(
        () => authStore.usuario,
        (usuario) => {
          if (usuario) {
            clearTimeout(timeout);
            stop();
            resolve();
          }
        }
      );
    });
  }

  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated();
  const isAdmin = authStore.isAdministrador();
  const isAdminRoute = to.path.startsWith("/admin");

  console.log("🛣️ Router Guard EVALUACIÓN:", {
    to: to.path,
    from: from.path,
    isAuthenticated,
    isAdmin,
    isAdminRoute,
    requiresAuth,
    hasUser: !!authStore.user,
    hasUsuario: !!authStore.usuario,
    usuarioTipo: authStore.usuario?.tipo,
  });

  // Permitir acceso directo a reset-password sin redirecciones
  if (to.name === "ResetPassword") {
    console.log(
      "🔓 Router: Permitiendo acceso a ResetPassword sin validación de auth"
    );
    return next();
  }

  // Permitir acceso libre a Home (página principal pública)
  if (to.name === "Home") {
    console.log("🏠 Router: Acceso libre a Home permitido");
    return next();
  }

  // Si la ruta requiere autenticación y no está autenticado
  if (requiresAuth && !isAuthenticated) {
    console.log("🚫 Router: No autenticado, redirigiendo a Login");
    return next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
  }

  // Si es una ruta de admin y no es administrador
  if (isAdminRoute && isAuthenticated && !isAdmin) {
    console.log("🚫 Router: Usuario no es admin, redirigiendo a Dashboard");
    // Evitar bucle de redirección
    if (from.path === "/dashboard") {
      console.warn("⚠️ Router: Evitando bucle de redirección");
      return next(false);
    }
    return next({ name: "Dashboard" });
  }

  // Si intenta acceder a Login/Register estando autenticado
  if (isAuthenticated && (to.name === "Login" || to.name === "Register")) {
    console.log("✓ Router: Ya autenticado, redirigiendo según tipo de usuario");
    // Redirigir según el tipo de usuario
    if (isAdmin) {
      return next({ name: "AdminPanel" });
    } else {
      return next({ name: "Dashboard" });
    }
  }

  console.log("✓ Router: Navegación permitida a", to.path);
  return next();
});

export default router;
