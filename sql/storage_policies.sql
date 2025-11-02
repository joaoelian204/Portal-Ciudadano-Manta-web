-- =====================================================
-- POLÍTICAS DE SEGURIDAD PARA STORAGE (BUCKET: imagenes)
-- =====================================================
-- Este archivo configura las políticas de Row Level Security (RLS)
-- para el bucket de almacenamiento de imágenes en Supabase.
--
-- IMPORTANTE: Ejecutar estas políticas en el SQL Editor de Supabase
-- =====================================================

-- 1. Habilitar RLS en el bucket 'imagenes' (si no está habilitado)
-- Esto se hace desde la interfaz de Supabase Storage, pero aquí está la referencia:
-- Storage > imagenes > Policies > Enable RLS

-- =====================================================
-- POLÍTICAS PARA NOTICIAS
-- =====================================================

-- Permitir a administradores subir imágenes en la carpeta noticias/
CREATE POLICY "Administradores pueden subir imágenes de noticias"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'noticias'
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE id = auth.uid()
  )
);

-- Permitir a administradores actualizar sus propias imágenes de noticias
CREATE POLICY "Administradores pueden actualizar imágenes de noticias"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'noticias'
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE id = auth.uid()
  )
);

-- Permitir a administradores eliminar imágenes de noticias
CREATE POLICY "Administradores pueden eliminar imágenes de noticias"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'noticias'
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE id = auth.uid()
  )
);

-- Permitir lectura pública de todas las imágenes (para que los ciudadanos puedan verlas)
CREATE POLICY "Lectura pública de imágenes"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'imagenes'
);

-- =====================================================
-- POLÍTICAS PARA REPORTES (para uso futuro)
-- =====================================================

-- Permitir a usuarios autenticados subir imágenes de reportes
CREATE POLICY "Usuarios pueden subir imágenes de reportes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'reportes'
  AND EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = auth.uid()
  )
);

-- Permitir a usuarios eliminar sus propias imágenes de reportes
CREATE POLICY "Usuarios pueden eliminar sus imágenes de reportes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'reportes'
  AND owner = auth.uid()
);

-- =====================================================
-- POLÍTICAS PARA ENCUESTAS (para uso futuro)
-- =====================================================

-- Permitir a administradores subir imágenes de encuestas
CREATE POLICY "Administradores pueden subir imágenes de encuestas"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'encuestas'
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE id = auth.uid()
  )
);

-- Permitir a administradores eliminar imágenes de encuestas
CREATE POLICY "Administradores pueden eliminar imágenes de encuestas"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'imagenes' 
  AND (storage.foldername(name))[1] = 'encuestas'
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE id = auth.uid()
  )
);

-- =====================================================
-- CONFIGURACIÓN ADICIONAL DEL BUCKET
-- =====================================================
-- En la interfaz de Supabase Storage, configura:
-- 
-- 1. Public bucket: OFF (mejor controlar acceso por políticas)
-- 2. File size limit: 5MB (5242880 bytes)
-- 3. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
--
-- Esto se hace en: Storage > imagenes > Configuration
-- =====================================================

-- =====================================================
-- VERIFICACIÓN DE POLÍTICAS
-- =====================================================
-- Para verificar que las políticas están activas, ejecuta:
-- 
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
-- 
-- Deberías ver todas las políticas listadas arriba
-- =====================================================
