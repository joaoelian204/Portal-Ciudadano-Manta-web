import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import { conditionalStorage } from "./storage";

// Validar que las variables de entorno existan
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Faltan las credenciales de Supabase. Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env"
  );
}

// Crear cliente de Supabase con tipado completo
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: conditionalStorage as any, // Usar almacenamiento condicional personalizado
      flowType: "pkce", // Más seguro para SPAs
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "X-Client-Info": "portal-ciudadano-manta@1.0.0",
      },
    },
    // Timeout reducido para operaciones
    realtime: {
      timeout: 10000,
    },
  }
);

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: any) => {
  console.error("❌ Error de Supabase:", error);

  if (error.message) {
    return error.message;
  }

  return "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.";
};

// Helper para verificar si el usuario está autenticado
export const isAuthenticated = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};

// Helper para obtener el usuario actual
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
