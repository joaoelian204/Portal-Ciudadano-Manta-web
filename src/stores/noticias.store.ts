import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/database.types";
import { useAuthStore } from "./auth.store";

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];
type InsertNoticia = Database["public"]["Tables"]["noticias"]["Insert"];

export const useNoticiasStore = defineStore("noticias", () => {
  // Estado
  const noticias = ref<Noticia[]>([]);
  const noticiaActual = ref<Noticia | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchNoticias = async (filtros?: {
    parroquia?: string;
    barrio?: string;
  }) => {
    // Si ya está cargando, retornar éxito con datos actuales
    if (loading.value) {
      console.log(
        "⏳ Ya hay una carga en progreso (fetchNoticias), retornando datos actuales"
      );
      return { success: true, data: noticias.value };
    }

    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false });

      // Si NO hay filtros, obtener solo noticias globales
      if (!filtros?.parroquia) {
        console.log("🌍 Sin filtros: mostrando solo noticias globales");
        query = query.is("parroquia_destino", null);
      } else {
        // Si hay filtros de ubicación, usar la misma lógica que fetchNoticiasUsuario
        if (filtros.barrio) {
          // Usuario tiene barrio: mostrar globales, de su parroquia sin barrio, y de su barrio específico
          query = query.or(
            `parroquia_destino.is.null,and(parroquia_destino.eq.${filtros.parroquia},barrio_destino.is.null),and(parroquia_destino.eq.${filtros.parroquia},barrio_destino.eq.${filtros.barrio})`
          );
          console.log(
            `📍 Filtrando: Globales + Parroquia "${filtros.parroquia}" + Barrio "${filtros.barrio}"`
          );
        } else {
          // Usuario solo tiene parroquia: mostrar globales y de su parroquia (sin barrio específico)
          query = query.or(
            `parroquia_destino.is.null,and(parroquia_destino.eq.${filtros.parroquia},barrio_destino.is.null)`
          );
          console.log(
            `📍 Filtrando: Globales + Parroquia "${filtros.parroquia}"`
          );
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      noticias.value = data || [];

      console.log(`✅ ${noticias.value.length} noticias cargadas`);

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo noticias:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log("🔓 Loading liberado (fetchNoticias)");
    }
  };

  const fetchNoticia = async (id: string) => {
    console.log("🔍 [Store] Iniciando fetchNoticia para ID:", id);
    loading.value = true;
    error.value = null;
    noticiaActual.value = null; // Limpiar estado anterior

    try {
      const { data, error: fetchError } = await supabase
        .from("noticias")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("❌ [Store] Error de Supabase:", fetchError);
        throw fetchError;
      }

      if (!data) {
        console.warn("⚠️ [Store] No se encontró data para ID:", id);
        throw new Error("Noticia no encontrada");
      }

      noticiaActual.value = data;
      console.log("✅ [Store] Noticia asignada a noticiaActual");

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      noticiaActual.value = null;
      console.error("❌ [Store] Error obteniendo noticia:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log("🔓 [Store] Loading liberado (fetchNoticia)");
    }
  };

  const crearNoticia = async (
    noticia: Omit<InsertNoticia, "administrador_id">
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error("Usuario no autenticado");

      // Verificar que es administrador
      const { data: admin } = await supabase
        .from("administradores")
        .select("id")
        .eq("id", authStore.user.id)
        .single();

      if (!admin) throw new Error("Usuario no es administrador");

      const { data, error: insertError } = await (
        supabase.from("noticias") as any
      )
        .insert({
          ...noticia,
          administrador_id: authStore.user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      noticias.value.unshift(data);
      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error creando noticia:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const actualizarNoticia = async (
    id: string,
    updates: Partial<Omit<InsertNoticia, "administrador_id">>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await (
        supabase.from("noticias") as any
      )
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Actualizar en la lista local
      const index = noticias.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        noticias.value[index] = data;
      }

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error actualizando noticia:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const eliminarNoticia = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("noticias")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Remover de la lista local
      noticias.value = noticias.value.filter((n) => n.id !== id);

      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error eliminando noticia:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const fetchNoticiasUsuario = async (parroquia: string, barrio?: string) => {
    // Si ya está cargando, retornar éxito con datos actuales
    if (loading.value) {
      console.log(
        "⏳ Ya hay una carga en progreso (noticias), retornando datos actuales"
      );
      return { success: true, data: noticias.value };
    }

    loading.value = true;
    error.value = null;

    try {
      console.log("🔍 Filtrando noticias para:", { parroquia, barrio });

      // Construir filtros específicos según la lógica:
      // 1. Noticias globales (parroquia_destino = null)
      // 2. Noticias de la parroquia del usuario (parroquia_destino = parroquia AND barrio_destino = null)
      // 3. Si tiene barrio: Noticias del barrio específico (parroquia_destino = parroquia AND barrio_destino = barrio)

      let query = supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false });

      if (barrio) {
        // Usuario tiene barrio: mostrar globales, de su parroquia sin barrio, y de su barrio específico
        query = query.or(
          `parroquia_destino.is.null,and(parroquia_destino.eq.${parroquia},barrio_destino.is.null),and(parroquia_destino.eq.${parroquia},barrio_destino.eq.${barrio})`
        );
        console.log(
          `📍 Filtrando: Globales + Parroquia "${parroquia}" + Barrio "${barrio}"`
        );
      } else {
        // Usuario solo tiene parroquia: mostrar globales y de su parroquia (sin barrio específico)
        query = query.or(
          `parroquia_destino.is.null,and(parroquia_destino.eq.${parroquia},barrio_destino.is.null)`
        );
        console.log(`📍 Filtrando: Globales + Parroquia "${parroquia}"`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("❌ Error de Supabase:", fetchError);
        throw fetchError;
      }

      noticias.value = data || [];
      console.log(
        `✅ ${noticias.value.length} noticias cargadas para el usuario`
      );

      // Log de debug para ver qué noticias se cargaron
      noticias.value.forEach((n) => {
        const tipo = !n.parroquia_destino
          ? "🌍 Global"
          : n.barrio_destino
          ? `📍 ${n.parroquia_destino} - ${n.barrio_destino}`
          : `📍 ${n.parroquia_destino}`;
        console.log(`  - ${tipo}: ${n.titulo}`);
      });

      return { success: true, data: noticias.value };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo noticias del usuario:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log("🔓 Loading liberado (noticias)");
    }
  };

  const fetchTodasLasNoticias = async () => {
    // Función para administradores: obtener TODAS las noticias sin filtros
    if (loading.value) {
      console.log(
        "⏳ Ya hay una carga en progreso (fetchTodasLasNoticias), retornando datos actuales"
      );
      return { success: true, data: noticias.value };
    }

    loading.value = true;
    error.value = null;

    try {
      console.log("👤 Administrador: cargando TODAS las noticias sin filtros");

      const { data, error: fetchError } = await supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("❌ Error de Supabase:", fetchError);
        throw fetchError;
      }

      noticias.value = data || [];
      console.log(
        `✅ ${noticias.value.length} noticias cargadas (TODAS - Admin)`
      );

      // Log de debug para ver qué noticias se cargaron
      noticias.value.forEach((n) => {
        const tipo = !n.parroquia_destino
          ? "🌍 Global"
          : n.barrio_destino
          ? `📍 ${n.parroquia_destino} - ${n.barrio_destino}`
          : `📍 ${n.parroquia_destino}`;
        console.log(`  - ${tipo}: ${n.titulo}`);
      });

      return { success: true, data: noticias.value };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo todas las noticias:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log("🔓 Loading liberado (fetchTodasLasNoticias)");
    }
  };

  return {
    // Estado
    noticias,
    noticiaActual,
    loading,
    error,
    // Actions
    fetchNoticias,
    fetchNoticia,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    fetchNoticiasUsuario,
    fetchTodasLasNoticias,
  };
});
