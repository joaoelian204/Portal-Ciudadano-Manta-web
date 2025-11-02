-- ============================================
-- SCRIPT DE DIAGNÓSTICO RLS
-- Ejecuta este script en Supabase SQL Editor para diagnosticar problemas
-- ============================================

-- 1. Verificar si RLS está habilitado en las tablas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('noticias', 'encuestas', 'respuestas_encuestas', 'usuarios', 'administradores', 'reportes')
ORDER BY tablename;

-- 2. Ver todas las políticas activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Verificar índices en las tablas (importante para performance)
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('noticias', 'encuestas', 'respuestas_encuestas', 'usuarios', 'administradores')
ORDER BY tablename, indexname;

-- 4. Contar registros en cada tabla
SELECT 'noticias' as tabla, COUNT(*) as total FROM public.noticias
UNION ALL
SELECT 'encuestas', COUNT(*) FROM public.encuestas
UNION ALL
SELECT 'respuestas_encuestas', COUNT(*) FROM public.respuestas_encuestas
UNION ALL
SELECT 'usuarios', COUNT(*) FROM public.usuarios
UNION ALL
SELECT 'administradores', COUNT(*) FROM public.administradores
UNION ALL
SELECT 'reportes', COUNT(*) FROM public.reportes;

-- 5. Verificar tiempo de respuesta de consultas comunes
EXPLAIN ANALYZE
SELECT * FROM public.encuestas WHERE activa = true;

EXPLAIN ANALYZE
SELECT * FROM public.noticias WHERE parroquia_destino IS NULL;
