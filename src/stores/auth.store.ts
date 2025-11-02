import type { User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { ref } from "vue";
import { conditionalStorage } from "../lib/storage";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/database.types";

type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];

export const useAuthStore = defineStore("auth", () => {
  // Estado
  const user = ref<User | null>(null);
  const usuario = ref<Usuario | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const fetchingUser = ref(false); // Flag para evitar fetch concurrente

  // Getters
  const isAuthenticated = () => !!user.value;
  const isCiudadano = () => usuario.value?.tipo === "ciudadano";
  const isAdministrador = () => usuario.value?.tipo === "administrador";

  // Actions
  const initAuth = async () => {
    loading.value = true;
    try {
      // Obtener sesión actual
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        user.value = session.user;
        await fetchUsuario(session.user.id);
      }

      // Escuchar cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("🔐 Auth state change:", event);

        // Manejar diferentes eventos
        if (event === "SIGNED_OUT") {
          user.value = null;
          usuario.value = null;
        } else if (event === "TOKEN_REFRESHED") {
          console.log("🔄 Token refrescado exitosamente");
          user.value = session?.user ?? null;
          // No refetch usuario, solo actualizar el user
        } else if (event === "SIGNED_IN") {
          // Solo refetch si no tenemos usuario o es diferente
          if (!usuario.value || user.value?.id !== session?.user?.id) {
            console.log("🆕 Nuevo inicio de sesión detectado");
            user.value = session?.user ?? null;
            if (session?.user) {
              await fetchUsuario(session.user.id);
            } else {
              usuario.value = null;
            }
          } else {
            console.log("✓ Usuario ya cargado, ignorando SIGNED_IN duplicado");
            user.value = session?.user ?? null;
          }
        } else if (event === "USER_UPDATED") {
          console.log("🔄 Usuario actualizado");
          user.value = session?.user ?? null;
          if (session?.user && usuario.value) {
            // Solo refetch si ya tenemos datos de usuario
            await fetchUsuario(session.user.id);
          }
        }
      });
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error inicializando autenticación:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchUsuario = async (userId: string) => {
    // Si ya está cargando, retornar los datos actuales
    if (fetchingUser.value) {
      console.log(
        "⏳ Ya hay un fetch de usuario en progreso, usando datos actuales"
      );
      return usuario.value;
    }

    fetchingUser.value = true;

    try {
      console.log("👤 Obteniendo datos de usuario:", userId);

      // Timeout de 10 segundos para fetchUsuario
      const fetchPromise = supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout obteniendo usuario")), 10000)
      );

      const { data, error: fetchError } = await Promise.race([
        fetchPromise,
        timeoutPromise as any,
      ]);

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          console.warn(
            "⚠️ Usuario no encontrado en tabla usuarios, buscando en administradores..."
          );

          // Buscar en tabla administradores
          const { data: admin, error: adminError } = await supabase
            .from("administradores")
            .select("id, nombres, email")
            .eq("id", userId)
            .maybeSingle();

          const adminData = admin as {
            id: string;
            nombres: string;
            email?: string;
          } | null;

          if (adminError || !adminData) {
            console.error("❌ Usuario no encontrado en ninguna tabla");
            usuario.value = null;
            return null;
          }

          // Si existe en administradores, crear objeto usuario
          usuario.value = {
            id: adminData.id,
            email: adminData.email ?? "",
            nombres: adminData.nombres,
            apellidos: "",
            cedula: "",
            parroquia: "",
            barrio: "",
            tipo: "administrador",
            activo: true,
            created_at: "",
            updated_at: "",
          };

          console.log(
            "✅ Datos de administrador obtenidos:",
            adminData.nombres
          );
          return usuario.value;
        }
        throw fetchError;
      }

      if (!data) {
        console.warn(
          "⚠️ Usuario no existe en tabla usuarios, buscando en administradores..."
        );

        // Buscar en tabla administradores
        const { data: admin, error: adminError } = await supabase
          .from("administradores")
          .select("id, nombres, email")
          .eq("id", userId)
          .maybeSingle();

        const adminData = admin as {
          id: string;
          nombres: string;
          email?: string;
        } | null;

        if (adminError || !adminData) {
          console.error("❌ Usuario no encontrado en ninguna tabla");
          usuario.value = null;
          return null;
        }

        // Si existe en administradores, crear objeto usuario
        usuario.value = {
          id: adminData.id,
          email: adminData.email ?? "",
          nombres: adminData.nombres,
          apellidos: "",
          cedula: "",
          parroquia: "",
          barrio: "",
          tipo: "administrador",
          activo: true,
          created_at: "",
          updated_at: "",
        };

        console.log("✅ Datos de administrador obtenidos:", adminData.nombres);
        return usuario.value;
      }

      usuario.value = data;
      console.log("✅ Datos de usuario obtenidos:", data.nombres, data.tipo);
      return data;
    } catch (err: any) {
      console.error("❌ Error obteniendo usuario:", err.message);
      usuario.value = null;
      return null;
    } finally {
      fetchingUser.value = false;
      console.log("🔓 Fetch usuario liberado");
    }
  };

  const register = async (
    email: string,
    password: string,
    userData: {
      nombres: string;
      apellidos: string;
      cedula: string;
      parroquia?: string;
      barrio?: string;
      tipo: "ciudadano" | "administrador";
    }
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombres: userData.nombres,
            apellidos: userData.apellidos,
            cedula: userData.cedula,
            parroquia: userData.parroquia,
            barrio: userData.barrio,
            tipo: userData.tipo,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Error al crear usuario");

      user.value = authData.user;

      // Si es ciudadano, crear en usuarios
      if (userData.tipo === "ciudadano") {
        await (supabase.from("usuarios") as any).insert({
          id: authData.user.id,
          email,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          cedula: userData.cedula,
          parroquia: userData.parroquia ?? "",
          barrio: userData.barrio ?? "",
          tipo: "ciudadano",
          activo: true,
        });
      }
      // Si es administrador, crear solo en administradores
      if (userData.tipo === "administrador") {
        await (supabase.from("administradores") as any).insert({
          id: authData.user.id,
          email,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          cedula: userData.cedula,
          activo: true,
        });
      }

      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Configurar el tipo de almacenamiento ANTES de iniciar sesión
      // true = localStorage (permanente, persiste al cerrar navegador)
      // false = sessionStorage (temporal, se borra al cerrar navegador)
      conditionalStorage.setPersistence(rememberMe);

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;
      if (!data.user) throw new Error("Error al iniciar sesión");

      user.value = data.user;

      // Buscar usuario en la tabla usuarios
      const usuarioData = (await fetchUsuario(data.user.id)) as
        | Database["public"]["Tables"]["usuarios"]["Row"]
        | null;

      if (!usuarioData) {
        // Si no existe en usuarios, buscar en administradores
        const { data: admin } = await supabase
          .from("administradores")
          .select("id, nombres")
          .eq("id", data.user.id)
          .single();
        const adminData = admin as { id: string; nombres: string } | null;
        if (!adminData) {
          usuario.value = null;
        } else {
          // Si existe en administradores, setear usuario como tipo administrador
          usuario.value = {
            id: adminData.id,
            email: data.user.email ?? "",
            nombres: adminData.nombres,
            apellidos: "",
            cedula: "",
            parroquia: "",
            barrio: "",
            tipo: "administrador",
            activo: true,
            created_at: "",
            updated_at: "",
          };
        }
      }

      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error en login:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      console.log("🚪 Iniciando logout...");

      // Limpiar estado local inmediatamente
      user.value = null;
      usuario.value = null;

      // Intentar hacer signOut con timeout
      const logoutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Logout timeout")), 5000)
      );

      try {
        await Promise.race([logoutPromise, timeoutPromise]);
        console.log("✅ Logout exitoso");
      } catch (timeoutError) {
        console.warn(
          "⚠️ Logout timeout, pero estado local limpiado:",
          timeoutError
        );
        // Continuar de todas formas ya que el estado local está limpio
      }

      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error en logout:", err);

      // Asegurarse de que el estado esté limpio incluso con error
      user.value = null;
      usuario.value = null;

      // Considerar el logout como exitoso si el estado local está limpio
      return { success: true, warning: err.message };
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (email: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;
      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error al restablecer contraseña:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (updates: Partial<Usuario>) => {
    loading.value = true;
    error.value = null;

    try {
      if (!user.value) throw new Error("Usuario no autenticado");

      const { error: updateError } = await (supabase.from("usuarios") as any)
        .update(updates)
        .eq("id", user.value.id);

      if (updateError) throw updateError;

      await fetchUsuario(user.value.id);
      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error actualizando perfil:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    // Estado
    user,
    usuario,
    loading,
    error,
    // Getters
    isAuthenticated,
    isCiudadano,
    isAdministrador,
    // Actions
    initAuth,
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
  };
});
