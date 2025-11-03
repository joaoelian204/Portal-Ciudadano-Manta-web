-- Agregar campos de ubicación a la tabla encuestas para filtrado por alcance
-- Similar a la tabla noticias, esto permite encuestas globales, por parroquia o por barrio

-- Agregar columnas de ubicación
ALTER TABLE encuestas
ADD COLUMN IF NOT EXISTS parroquia_destino TEXT,
ADD COLUMN IF NOT EXISTS barrio_destino TEXT;

-- Agregar comentarios para documentar
COMMENT ON COLUMN encuestas.parroquia_destino IS 'Parroquia a la que está dirigida la encuesta. NULL = encuesta global';
COMMENT ON COLUMN encuestas.barrio_destino IS 'Barrio específico al que está dirigida la encuesta. NULL con parroquia = toda la parroquia';

-- Crear índices para mejorar el rendimiento de las consultas de filtrado
CREATE INDEX IF NOT EXISTS idx_encuestas_parroquia ON encuestas(parroquia_destino);
CREATE INDEX IF NOT EXISTS idx_encuestas_barrio ON encuestas(barrio_destino);
CREATE INDEX IF NOT EXISTS idx_encuestas_ubicacion ON encuestas(parroquia_destino, barrio_destino);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Columnas de ubicación agregadas exitosamente a la tabla encuestas';
  RAISE NOTICE 'Índices creados para optimizar las consultas de filtrado';
END $$;
