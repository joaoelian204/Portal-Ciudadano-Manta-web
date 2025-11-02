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
      console.log('⏳ Ya hay una carga en progreso (fetchNoticias), retornando datos actuales');
      return { success: true, data: noticias.value };
    }

    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false });

      // Si hay filtros, obtener noticias globales O las específicas de la ubicación
      if (filtros?.parroquia) {
        // Noticias globales (parroquia_destino es null) O noticias de la parroquia específica
        query = query.or(
          `parroquia_destino.is.null,parroquia_destino.eq.${filtros.parroquia}`
        );
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      noticias.value = data || [];

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo noticias:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log('🔓 Loading liberado (fetchNoticias)');
    }
  };

  const fetchNoticia = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("noticias")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      noticiaActual.value = data;

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo noticia:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const crearNoticia = async (noticia: Omit<InsertNoticia, "administrador_id">) => {
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
      console.log('⏳ Ya hay una carga en progreso (noticias), retornando datos actuales');
      return { success: true, data: noticias.value };
    }
    
    loading.value = true;
    error.value = null;

    try {
      // Obtener noticias globales (sin parroquia_destino) o de la parroquia del usuario
      const { data, error: fetchError } = await supabase
        .from("noticias")
        .select("*")
        .or(`parroquia_destino.is.null,parroquia_destino.eq.${parroquia}`)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("❌ Error de Supabase:", fetchError);
        throw fetchError;
      }

      // Si hay barrio específico, filtrar también por barrio
      let filteredData = data || [];
      if (barrio && filteredData.length > 0) {
        filteredData = filteredData.filter(
          (n: Noticia) =>
            !n.barrio_destino || // Global de parroquia
            n.barrio_destino === barrio // Específico del barrio
        );
      }

      noticias.value = filteredData;
      console.log(`✅ ${filteredData.length} noticias cargadas`);

      return { success: true, data: filteredData };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo noticias del usuario:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log('🔓 Loading liberado (noticias)');
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
  };
});
