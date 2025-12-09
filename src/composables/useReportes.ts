import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Reporte = Database['public']['Tables']['reportes']['Row'];

export function useReportes() {
  const reportes = ref<Reporte[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene los reportes de un usuario específico
   */
  async function obtenerReportesUsuario(usuarioId: string): Promise<Reporte[]> {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: supabaseError } = await supabase
        .from('reportes')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('❌ Error al obtener reportes del usuario:', supabaseError);
        error.value = supabaseError.message;
        return [];
      }

      reportes.value = data || [];
      console.log('✅ Reportes del usuario obtenidos:', reportes.value.length);
      return reportes.value;
    } catch (err: any) {
      console.error('❌ Error en obtenerReportesUsuario:', err);
      error.value = err.message || 'Error desconocido';
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Agrupa los reportes por estado
   */
  function agruparPorEstado(reportesArray: Reporte[]) {
    const agrupados: Record<string, Reporte[]> = {
      pendiente: [],
      en_revision: [],
      aceptado: [],
      en_proceso: [],
      resuelto: [],
      rechazado: [],
      duplicado: [],
    };

    reportesArray.forEach((reporte) => {
      const estado = reporte.estado as keyof typeof agrupados;
      if (agrupados[estado]) {
        agrupados[estado].push(reporte);
      }
    });

    return agrupados;
  }

  /**
   * Obtiene el conteo de reportes por estado
   */
  function contarPorEstado(reportesArray: Reporte[]) {
    const conteo: Record<string, number> = {
      pendiente: 0,
      en_revision: 0,
      aceptado: 0,
      en_proceso: 0,
      resuelto: 0,
      rechazado: 0,
      duplicado: 0,
    };

    reportesArray.forEach((reporte) => {
      const estado = reporte.estado as keyof typeof conteo;
      if (conteo[estado] !== undefined) {
        conteo[estado]++;
      }
    });

    return conteo;
  }

  return {
    reportes,
    loading,
    error,
    obtenerReportesUsuario,
    agruparPorEstado,
    contarPorEstado,
  };
}
