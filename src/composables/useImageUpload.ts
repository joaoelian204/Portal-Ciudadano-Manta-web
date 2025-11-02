import { ref } from 'vue';
import { supabase } from '../lib/supabase';

interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useImageUpload(options: UploadOptions = { bucket: 'imagenes' }) {
  const {
    bucket = 'imagenes',
    folder = '',
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  } = options;

  const uploading = ref(false);
  const error = ref<string | null>(null);
  const imageUrl = ref<string>('');

  /**
   * Sube una imagen al storage de Supabase
   */
  const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      const allowedFormats = allowedTypes.map(t => t.split('/')[1]?.toUpperCase() || '').join(', ');
      error.value = `Formato no válido. Solo se permiten: ${allowedFormats}`;
      return { success: false, error: error.value };
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      error.value = `La imagen es muy grande. El tamaño máximo es ${maxSizeMB}MB`;
      return { success: false, error: error.value };
    }

    uploading.value = true;
    error.value = null;

    try {
      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      console.log('📤 Subiendo imagen:', filePath);

      // Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Error al subir imagen:', uploadError);
        throw uploadError;
      }

      console.log('✅ Imagen subida:', data);

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL pública');
      }

      imageUrl.value = publicUrlData.publicUrl;
      console.log('🔗 URL pública:', publicUrlData.publicUrl);

      return { success: true, url: publicUrlData.publicUrl };

    } catch (err: any) {
      console.error('❌ Error en uploadImage:', err);
      error.value = err.message || 'Error al subir la imagen';
      return { success: false, error: error.value || undefined };
    } finally {
      uploading.value = false;
    }
  };

  /**
   * Elimina una imagen del storage de Supabase
   */
  const deleteImage = async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Extraer el path de la URL pública
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === bucket);
      
      if (bucketIndex === -1) {
        console.warn('⚠️ No se pudo identificar el bucket en la URL');
        return { success: false, error: 'URL de imagen inválida' };
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      console.log('🗑️ Eliminando imagen:', filePath);
      
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (deleteError) {
        console.warn('⚠️ Error al eliminar imagen:', deleteError);
        throw deleteError;
      }

      console.log('✅ Imagen eliminada del storage');
      return { success: true };

    } catch (err: any) {
      console.error('❌ Error en deleteImage:', err);
      error.value = err.message || 'Error al eliminar la imagen';
      return { success: false, error: error.value || undefined };
    }
  };

  /**
   * Resetea el estado
   */
  const reset = () => {
    uploading.value = false;
    error.value = null;
    imageUrl.value = '';
  };

  return {
    uploading,
    error,
    imageUrl,
    uploadImage,
    deleteImage,
    reset
  };
}
