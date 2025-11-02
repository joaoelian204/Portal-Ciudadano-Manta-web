-- ============================================
-- ÍNDICES PARA OPTIMIZAR RENDIMIENTO
-- Estos índices aceleran las consultas RLS y las búsquedas frecuentes
-- ============================================

-- TABLA ENCUESTAS
-- Índice compuesto para filtrar encuestas activas por fecha
CREATE INDEX IF NOT EXISTS idx_encuestas_activa_fechas 
ON public.encuestas (activa, fecha_inicio, fecha_fin);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_encuestas_created_at 
ON public.encuestas (created_at DESC);

-- TABLA NOTICIAS
-- Índice para noticias globales (parroquia_destino es NULL)
CREATE INDEX IF NOT EXISTS idx_noticias_global 
ON public.noticias (parroquia_destino) 
WHERE parroquia_destino IS NULL;

-- Índice compuesto para filtrar por ubicación
CREATE INDEX IF NOT EXISTS idx_noticias_ubicacion 
ON public.noticias (parroquia_destino, barrio_destino);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_noticias_created_at 
ON public.noticias (created_at DESC);

-- Índice para administrador (RLS policies)
CREATE INDEX IF NOT EXISTS idx_noticias_administrador 
ON public.noticias (administrador_id);

-- TABLA USUARIOS
-- Índice para búsquedas por ubicación (usado en RLS)
CREATE INDEX IF NOT EXISTS idx_usuarios_ubicacion 
ON public.usuarios (parroquia, barrio);

-- Índice para búsqueda por id (auth.uid())
CREATE INDEX IF NOT EXISTS idx_usuarios_id 
ON public.usuarios (id);

-- TABLA ADMINISTRADORES
-- Índice compuesto para verificación de admin activo
CREATE INDEX IF NOT EXISTS idx_administradores_activo 
ON public.administradores (id, activo);

-- TABLA RESPUESTAS_ENCUESTAS
-- Índice compuesto para verificar si usuario ya respondió
CREATE INDEX IF NOT EXISTS idx_respuestas_encuesta_usuario 
ON public.respuestas_encuestas (encuesta_id, usuario_id);

-- Índice para obtener respuestas por encuesta
CREATE INDEX IF NOT EXISTS idx_respuestas_encuesta_id 
ON public.respuestas_encuestas (encuesta_id);

-- TABLA REPORTES
-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_reportes_created_at 
ON public.reportes (created_at DESC);

-- Índice para filtrar por estado
CREATE INDEX IF NOT EXISTS idx_reportes_estado 
ON public.reportes (estado);

-- Índice para búsqueda por usuario
CREATE INDEX IF NOT EXISTS idx_reportes_usuario 
ON public.reportes (usuario_id);

-- ============================================
-- VERIFICAR ÍNDICES CREADOS
-- ============================================

SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('noticias', 'encuestas', 'respuestas_encuestas', 'usuarios', 'administradores', 'reportes')
ORDER BY tablename, indexname;
