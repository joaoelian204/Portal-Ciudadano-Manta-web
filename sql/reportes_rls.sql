-- ============================================
-- POLÍTICAS RLS PARA TABLA REPORTES
-- ============================================
-- Este script configura las políticas de seguridad a nivel de fila
-- para la tabla reportes del Portal Ciudadano de Manta

-- ============================================
-- 1. ELIMINAR POLÍTICAS EXISTENTES (si hay)
-- ============================================
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios reportes" ON public.reportes;
DROP POLICY IF EXISTS "Usuarios pueden crear reportes" ON public.reportes;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios reportes" ON public.reportes;
DROP POLICY IF EXISTS "Administradores pueden ver todos los reportes" ON public.reportes;
DROP POLICY IF EXISTS "Administradores pueden actualizar reportes" ON public.reportes;
DROP POLICY IF EXISTS "Administradores pueden eliminar reportes" ON public.reportes;

-- ============================================
-- 2. HABILITAR RLS
-- ============================================
ALTER TABLE "public"."reportes" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. POLÍTICAS DE SELECT (LECTURA)
-- ============================================

-- Los usuarios pueden ver sus propios reportes
CREATE POLICY "Usuarios pueden ver sus propios reportes"
ON public.reportes
FOR SELECT
TO authenticated
USING (
  auth.uid() = usuario_id
);

-- Los administradores pueden ver TODOS los reportes
CREATE POLICY "Administradores pueden ver todos los reportes"
ON public.reportes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
      AND usuarios.tipo = 'administrador'
  )
);

-- ============================================
-- 4. POLÍTICAS DE INSERT (CREACIÓN)
-- ============================================

-- Los usuarios autenticados pueden crear reportes
CREATE POLICY "Usuarios pueden crear reportes"
ON public.reportes
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = usuario_id
);

-- ============================================
-- 5. POLÍTICAS DE UPDATE (ACTUALIZACIÓN)
-- ============================================

-- Los usuarios pueden actualizar sus propios reportes (solo mientras están pendientes)
CREATE POLICY "Usuarios pueden actualizar sus propios reportes"
ON public.reportes
FOR UPDATE
TO authenticated
USING (
  auth.uid() = usuario_id
  AND estado = 'pendiente'
)
WITH CHECK (
  auth.uid() = usuario_id
  AND estado = 'pendiente'
);

-- Los administradores pueden actualizar cualquier reporte
CREATE POLICY "Administradores pueden actualizar reportes"
ON public.reportes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
      AND usuarios.tipo = 'administrador'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
      AND usuarios.tipo = 'administrador'
  )
);

-- ============================================
-- 6. POLÍTICAS DE DELETE (ELIMINACIÓN)
-- ============================================

-- Los administradores pueden eliminar reportes
CREATE POLICY "Administradores pueden eliminar reportes"
ON public.reportes
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
      AND usuarios.tipo = 'administrador'
  )
);

-- ============================================
-- 7. VERIFICACIÓN
-- ============================================
-- Ejecuta esto para verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'reportes'
ORDER BY policyname;
