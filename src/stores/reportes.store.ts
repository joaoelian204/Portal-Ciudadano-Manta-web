import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/database.types";
import { useAuthStore } from "./auth.store";

type Reporte = Database["public"]["Tables"]["reportes"]["Row"];
type InsertReporte = Database["public"]["Tables"]["reportes"]["Insert"];
type UpdateReporte = Database["public"]["Tables"]["reportes"]["Update"];

export const useReportesStore = defineStore("reportes", () => {
  // Estado
  const reportes = ref<Reporte[]>([]);
  const reporteActual = ref<Reporte | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchReportes = async (filtros?: {
    usuario_id?: string;
    estado?: Reporte["estado"];
    categoria?: Reporte["categoria"];
  }) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("reportes")
        .select("*")
        .order("created_at", { ascending: false });

      if (filtros?.usuario_id) {
        query = query.eq("usuario_id", filtros.usuario_id);
      }

      if (filtros?.estado) {
        query = query.eq("estado", filtros.estado);
      }

      if (filtros?.categoria) {
        query = query.eq("categoria", filtros.categoria);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      reportes.value = data || [];

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message ?? String(err);
      console.error("❌ Error obteniendo reportes:", err);
      return { success: false, error: err.message ?? String(err) };
    } finally {
      loading.value = false;
    }
  };

  const fetchReporte = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("reportes")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      reporteActual.value = data;

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message ?? String(err);
      console.error("❌ Error obteniendo reporte:", err);
      return { success: false, error: err.message ?? String(err) };
    } finally {
      loading.value = false;
    }
  };

  const crearReporte = async (reporte: Omit<InsertReporte, "usuario_id">) => {
    loading.value = true;
    error.value = null;

    try {
      const authStore = useAuthStore();
      console.log('🔐 Usuario autenticado:', authStore.user?.id);
      
      if (!authStore.user) throw new Error("Usuario no autenticado");

      const dataToInsert = {
        ...reporte,
        usuario_id: authStore.user.id,
      };
      
      console.log('📝 Datos a insertar:', dataToInsert);

      const { data, error: insertError } = await (
        supabase.from("reportes") as any
      )
        .insert(dataToInsert)
        .select()
        .single();

      console.log('📊 Respuesta de Supabase:', { data, error: insertError });

      if (insertError) {
        console.error('❌ Error detallado de Supabase:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        throw insertError;
      }

      reportes.value.unshift(data);
      return { success: true, data };
    } catch (err: any) {
      error.value = err.message ?? String(err);
      console.error("❌ Error creando reporte:", err);
      return { success: false, error: err.message ?? String(err) };
    } finally {
      loading.value = false;
    }
  };

  const actualizarReporte = async (
    id: string,
    updates: Omit<UpdateReporte, "id" | "usuario_id">
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await (
        supabase.from("reportes") as any
      )
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Actualizar en la lista local
      const index = reportes.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        reportes.value[index] = data;
      }

      if (reporteActual.value?.id === id) {
        reporteActual.value = data;
      }

      return { success: true, data };
    } catch (err: any) {
      error.value = err.message ?? String(err);
      console.error("❌ Error actualizando reporte:", err);
      return { success: false, error: err.message ?? String(err) };
    } finally {
      loading.value = false;
    }
  };

  const eliminarReporte = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("reportes")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      reportes.value = reportes.value.filter((r) => r.id !== id);

      return { success: true };
    } catch (err: any) {
      error.value = err.message ?? String(err);
      console.error("❌ Error eliminando reporte:", err);
      return { success: false, error: err.message ?? String(err) };
    } finally {
      loading.value = false;
    }
  };

  const subirImagen = async (file: File, reporteId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${reporteId}-${Date.now()}.${fileExt}`;
      const filePath = `reportes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const publicUrlData = supabase.storage
        .from("imagenes")
        .getPublicUrl(filePath);
      const publicUrl = publicUrlData.data?.publicUrl ?? null;

      return { success: true, url: publicUrl };
    } catch (err: any) {
      error.value = err.message ?? String(err);
      console.error("❌ Error subiendo imagen:", err);
      return { success: false, error: err.message ?? String(err) };
    } finally {
      loading.value = false;
    }
  };

  // Suscripción en tiempo real
  const subscribeToReportes = () => {
    const authStore = useAuthStore();

    return supabase
      .channel("reportes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reportes",
          filter: authStore.isCiudadano()
            ? `usuario_id=eq.${authStore.user?.id}`
            : undefined,
        },
        (payload) => {
          console.log("📡 Cambio en reportes:", payload);

          if (payload.eventType === "INSERT") {
            reportes.value.unshift(payload.new as Reporte);
          } else if (payload.eventType === "UPDATE") {
            const index = reportes.value.findIndex(
              (r) => r.id === payload.new.id
            );
            if (index !== -1) {
              reportes.value[index] = payload.new as Reporte;
            }
          } else if (payload.eventType === "DELETE") {
            reportes.value = reportes.value.filter(
              (r) => r.id !== payload.old.id
            );
          }
        }
      )
      .subscribe();
  };

  return {
    // Estado
    reportes,
    reporteActual,
    loading,
    error,
    // Actions
    fetchReportes,
    fetchReporte,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    subirImagen,
    subscribeToReportes,
  };
});
