import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/database.types";
import { useAuthStore } from "./auth.store";

type Encuesta = Database["public"]["Tables"]["encuestas"]["Row"];
type InsertEncuesta = Database["public"]["Tables"]["encuestas"]["Insert"];
type RespuestaEncuesta =
  Database["public"]["Tables"]["respuestas_encuestas"]["Row"];

export const useEncuestasStore = defineStore("encuestas", () => {
  // Estado
  const encuestas = ref<Encuesta[]>([]);
  const encuestaActual = ref<Encuesta | null>(null);
  const respuestas = ref<RespuestaEncuesta[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Helper para verificar sesión válida
  const checkSession = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.warn("⚠️ Sesión inválida o expirada");
        return false;
      }
      return true;
    } catch (err) {
      console.error("❌ Error verificando sesión:", err);
      return false;
    }
  };

  // Actions
  const fetchEncuestas = async (soloActivas = true) => {
    // Si ya está cargando, retornar éxito con datos actuales
    if (loading.value) {
      console.log('⏳ Ya hay una carga en progreso, retornando datos actuales');
      return { success: true, data: encuestas.value };
    }
    
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("encuestas")
        .select("*")
        .order("created_at", { ascending: false });

      if (soloActivas) {
        query = query.eq("activa", true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("❌ Error de Supabase:", fetchError);
        throw fetchError;
      }
      
      encuestas.value = data || [];
      console.log(`✅ ${data?.length || 0} encuestas cargadas`);

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo encuestas:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
      console.log('🔓 Loading liberado (encuestas)');
    }
  };

  const fetchEncuesta = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("encuestas")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      encuestaActual.value = data;

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo encuesta:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const crearEncuesta = async (encuesta: InsertEncuesta) => {
    loading.value = true;
    error.value = null;

    try {
      // Verificar sesión antes de operación crítica
      const sessionValid = await checkSession();
      if (!sessionValid) {
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }

      const { data, error: insertError } = await (
        supabase.from("encuestas") as any
      )
        .insert(encuesta)
        .select()
        .single();

      if (insertError) throw insertError;

      encuestas.value.unshift(data);
      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error creando encuesta:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const actualizarEncuesta = async (
    id: string,
    updates: Partial<InsertEncuesta>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await (
        supabase.from("encuestas") as any
      )
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Actualizar en la lista local
      const index = encuestas.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        encuestas.value[index] = data;
      }

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error actualizando encuesta:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const eliminarEncuesta = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("encuestas")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Remover de la lista local
      encuestas.value = encuestas.value.filter((e) => e.id !== id);

      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error eliminando encuesta:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const responderEncuesta = async (
    encuestaId: string,
    respuesta: Record<string, any>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error("Usuario no autenticado");

      // Verificar si ya respondió
      const { data: yaRespondio } = await supabase
        .from("respuestas_encuestas")
        .select("id")
        .eq("encuesta_id", encuestaId)
        .eq("usuario_id", authStore.user.id)
        .single();

      if (yaRespondio) {
        throw new Error("Ya has respondido esta encuesta");
      }

      const { data, error: insertError } = await (
        supabase.from("respuestas_encuestas") as any
      )
        .insert({
          encuesta_id: encuestaId,
          usuario_id: authStore.user.id,
          respuesta,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error respondiendo encuesta:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const fetchRespuestasEncuesta = async (encuestaId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("respuestas_encuestas")
        .select("*")
        .eq("encuesta_id", encuestaId);

      if (fetchError) throw fetchError;
      respuestas.value = data || [];

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo respuestas:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const verificarYaRespondio = async (encuestaId: string) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.user) return false;

      const { data } = await supabase
        .from("respuestas_encuestas")
        .select("id")
        .eq("encuesta_id", encuestaId)
        .eq("usuario_id", authStore.user.id)
        .single();

      return !!data;
    } catch (err) {
      return false;
    }
  };

  const obtenerEstadisticas = async (encuestaId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("respuestas_encuestas")
        .select("respuesta")
        .eq("encuesta_id", encuestaId);

      if (fetchError) throw fetchError;

      // Procesar estadísticas
      const estadisticas: Record<string, number> = {};
      (data as any)?.forEach((resp: any) => {
        const respuesta = resp.respuesta as any;
        Object.entries(respuesta).forEach(([_key, value]) => {
          const opcion = String(value);
          estadisticas[opcion] = (estadisticas[opcion] || 0) + 1;
        });
      });

      return { success: true, data: estadisticas, total: data?.length || 0 };
    } catch (err: any) {
      error.value = err.message;
      console.error("❌ Error obteniendo estadísticas:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    // Estado
    encuestas,
    encuestaActual,
    respuestas,
    loading,
    error,
    // Actions
    fetchEncuestas,
    fetchEncuesta,
    crearEncuesta,
    actualizarEncuesta,
    eliminarEncuesta,
    responderEncuesta,
    fetchRespuestasEncuesta,
    verificarYaRespondio,
    obtenerEstadisticas,
  };
});
