import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Reporte = Database['public']['Tables']['reportes']['Row'];

interface ReporteConUsuario extends Reporte {
  usuario?: {
    nombres: string;
    apellidos: string;
    cedula: string;
    email: string;
    parroquia: string;
    barrio: string;
  };
}

export function useReportePDF() {
  const estadoTexto: Record<string, string> = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aceptado: 'Aceptado',
    en_proceso: 'En Proceso',
    resuelto: 'Resuelto',
    rechazado: 'Rechazado',
    duplicado: 'Duplicado',
  };

  const categoriaTexto: Record<string, string> = {
    alumbrado: 'Alumbrado',
    baches: 'Baches',
    limpieza: 'Limpieza',
    agua: 'Agua',
    alcantarillado: 'Alcantarillado',
    parques: 'Parques',
    señalizacion: 'Señalización',
    seguridad: 'Seguridad',
    ruido: 'Ruido',
    otro: 'Otro',
  };

  const prioridadTexto: Record<string, string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    urgente: 'Urgente',
  };

  /**
   * Obtiene todos los reportes de la base de datos con información del usuario
   */
  async function obtenerTodosLosReportes(): Promise<ReporteConUsuario[]> {
    try {
      const { data, error } = await supabase
        .from('reportes')
        .select(`
          *,
          usuario:usuarios!reportes_usuario_id_fkey (
            nombres,
            apellidos,
            cedula,
            email,
            parroquia,
            barrio
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error al obtener reportes:', error);
        throw error;
      }

      return (data as any[])?.map((reporte) => ({
        ...reporte,
        usuario: reporte.usuario || undefined,
      })) || [];
    } catch (error) {
      console.error('❌ Error en obtenerTodosLosReportes:', error);
      throw error;
    }
  }

  /**
   * Formatea una fecha para el PDF
   */
  function formatearFecha(fecha: string | null): string {
    if (!fecha) return 'N/A';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  }

  /**
   * Genera un PDF con todos los reportes
   */
  async function generarInformePDF(): Promise<boolean> {
    try {
      console.log('📄 Iniciando generación de informe PDF...');

      // Obtener todos los reportes
      const reportes = await obtenerTodosLosReportes();

      if (reportes.length === 0) {
        alert('No hay reportes para generar el informe.');
        return false;
      }

      // Crear documento PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Configuración de colores
      const primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
      const secondaryColor: [number, number, number] = [241, 245, 249]; // Gray-100
      const textColor: [number, number, number] = [31, 41, 55]; // Gray-800

      // Encabezado del documento
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Banner superior
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 25, 'F');

      // Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORME DE REPORTES CIUDADANOS', pageWidth / 2, 12, {
        align: 'center',
      });

      // Subtítulo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Portal Ciudadano Manta', pageWidth / 2, 19, {
        align: 'center',
      });

      // Información del informe
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      const fechaGeneracion = new Date().toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Fecha de generación: ${fechaGeneracion}`, 14, 33);
      doc.text(`Total de reportes: ${reportes.length}`, 14, 39);

      // Estadísticas resumidas
      const estadisticas = calcularEstadisticas(reportes);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen por Estado:', 14, 47);
      doc.setFont('helvetica', 'normal');
      let yPos = 52;
      Object.entries(estadisticas.porEstado).forEach(([estado, cantidad]) => {
        doc.text(`${estadoTexto[estado] || estado}: ${cantidad}`, 20, yPos);
        yPos += 4;
      });

      // Preparar datos para la tabla
      const tableData = reportes.map((reporte) => [
        reporte.id.substring(0, 8) + '...',
        formatearFecha(reporte.created_at),
        reporte.usuario
          ? `${reporte.usuario.nombres} ${reporte.usuario.apellidos}`
          : 'N/A',
        reporte.usuario?.cedula || 'N/A',
        categoriaTexto[reporte.categoria] || reporte.categoria,
        reporte.descripcion.length > 50
          ? reporte.descripcion.substring(0, 47) + '...'
          : reporte.descripcion,
        `${reporte.ubicacion_parroquia}\n${reporte.ubicacion_barrio}`,
        estadoTexto[reporte.estado] || reporte.estado,
        prioridadTexto[reporte.prioridad] || reporte.prioridad,
      ]);

      // Generar tabla con autoTable
      autoTable(doc, {
        startY: yPos + 5,
        head: [
          [
            'ID',
            'Fecha',
            'Ciudadano',
            'Cédula',
            'Categoría',
            'Descripción',
            'Ubicación',
            'Estado',
            'Prioridad',
          ],
        ],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 7,
          textColor: textColor,
        },
        alternateRowStyles: {
          fillColor: secondaryColor,
        },
        columnStyles: {
          0: { cellWidth: 20 }, // ID
          1: { cellWidth: 30 }, // Fecha
          2: { cellWidth: 35 }, // Ciudadano
          3: { cellWidth: 22 }, // Cédula
          4: { cellWidth: 22 }, // Categoría
          5: { cellWidth: 45 }, // Descripción
          6: { cellWidth: 35 }, // Ubicación
          7: { cellWidth: 22 }, // Estado
          8: { cellWidth: 20 }, // Prioridad
        },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          // Pie de página
          const pageCount = (doc as any).internal.getNumberOfPages();
          const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
          
          doc.setFontSize(8);
          doc.setTextColor(128);
          doc.text(
            `Página ${currentPage} de ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );

          doc.text(
            'Portal Ciudadano Manta - Informe Confidencial',
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 5,
            { align: 'center' }
          );
        },
      });

      // Generar nombre del archivo
      const fechaArchivo = (new Date()
        .toISOString()
        .split('T')[0] || 'fecha')
        .replace(/-/g, '');
      const nombreArchivo = `Informe_Reportes_${fechaArchivo}.pdf`;

      // Descargar PDF
      doc.save(nombreArchivo);

      console.log('✅ PDF generado exitosamente:', nombreArchivo);
      return true;
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      alert('Error al generar el informe PDF. Por favor, intente nuevamente.');
      return false;
    }
  }

  /**
   * Calcula estadísticas de los reportes
   */
  function calcularEstadisticas(reportes: ReporteConUsuario[]) {
    const porEstado: Record<string, number> = {};
    const porCategoria: Record<string, number> = {};
    const porPrioridad: Record<string, number> = {};

    reportes.forEach((reporte) => {
      // Por estado
      porEstado[reporte.estado] = (porEstado[reporte.estado] || 0) + 1;

      // Por categoría
      porCategoria[reporte.categoria] =
        (porCategoria[reporte.categoria] || 0) + 1;

      // Por prioridad
      porPrioridad[reporte.prioridad] =
        (porPrioridad[reporte.prioridad] || 0) + 1;
    });

    return {
      porEstado,
      porCategoria,
      porPrioridad,
    };
  }

  return {
    generarInformePDF,
    obtenerTodosLosReportes,
  };
}
