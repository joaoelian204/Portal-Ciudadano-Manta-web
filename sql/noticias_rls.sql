-- ============================================
-- POLÍTICAS RLS PARA TABLA NOTICIAS
-- ============================================

-- 1. ELIMINAR POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "noticias_select_authenticated" ON "public"."noticias";
DROP POLICY IF EXISTS "noticias_select_public" ON "public"."noticias";
DROP POLICY IF EXISTS "noticias_insert_admin" ON "public"."noticias";
DROP POLICY IF EXISTS "noticias_update_admin" ON "public"."noticias";
DROP POLICY IF EXISTS "noticias_delete_admin" ON "public"."noticias";

-- 2. HABILITAR RLS
ALTER TABLE "public"."noticias" ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICA DE SELECT PARA USUARIOS AUTENTICADOS
-- Los usuarios autenticados pueden ver:
-- - Noticias globales (parroquia_destino IS NULL)
-- - Noticias de su parroquia
CREATE POLICY "noticias_select_authenticated"
ON "public"."noticias"
FOR SELECT
TO authenticated
USING (
  parroquia_destino IS NULL OR
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND (
      usuarios.parroquia = noticias.parroquia_destino
      AND (noticias.barrio_destino IS NULL OR usuarios.barrio = noticias.barrio_destino)
    )
  )
);

-- 4. POLÍTICA DE INSERT - Solo administradores
CREATE POLICY "noticias_insert_admin"
ON "public"."noticias"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.administradores
    WHERE administradores.id = auth.uid()
    AND administradores.activo = true
  )
  AND administrador_id = auth.uid()
);

-- 5. POLÍTICA DE UPDATE - Solo administradores que crearon la noticia
CREATE POLICY "noticias_update_admin"
ON "public"."noticias"
FOR UPDATE
TO authenticated
USING (
  administrador_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE administradores.id = auth.uid()
    AND administradores.activo = true
  )
)
WITH CHECK (
  administrador_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE administradores.id = auth.uid()
    AND administradores.activo = true
  )
);

-- 6. POLÍTICA DE DELETE - Solo administradores que crearon la noticia
CREATE POLICY "noticias_delete_admin"
ON "public"."noticias"
FOR DELETE
TO authenticated
USING (
  administrador_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.administradores
    WHERE administradores.id = auth.uid()
    AND administradores.activo = true
  )
);

-- ============================================
-- VERIFICAR POLÍTICAS
-- ============================================

SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'noticias';
