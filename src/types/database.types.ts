export type UUID = string;

export type Timestamp = string;

export type EncuestaTipo = "opcion_multiple" | "abierta" | "calificacion";
export type ReporteCategoria =
  | "alumbrado"
  | "baches"
  | "limpieza"
  | "agua"
  | "alcantarillado"
  | "parques"
  | "señalizacion"
  | "seguridad"
  | "ruido"
  | "otro";
export type ReporteEstado =
  | "pendiente"
  | "en_revision"
  | "aceptado"
  | "en_proceso"
  | "resuelto"
  | "rechazado"
  | "duplicado";
export type ReportePrioridad = "baja" | "media" | "alta" | "urgente";
export type UsuarioTipo = "ciudadano" | "administrador";

// administradores
export interface AdministradoresRow {
  id: UUID;
  email: string;
  nombres: string;
  apellidos: string;
  cedula: string; // length = 10
  activo: boolean | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
}

export type AdministradoresInsert = Omit<
  AdministradoresRow,
  "created_at" | "updated_at" | "activo"
> & {
  activo?: boolean;
  created_at?: Timestamp | null;
  updated_at?: Timestamp | null;
};

export type AdministradoresUpdate = Partial<AdministradoresRow> & { id: UUID };

// usuarios
export interface UsuariosRow {
  id: UUID;
  email: string;
  nombres: string;
  apellidos: string;
  cedula: string; // length = 10
  parroquia: string;
  barrio: string;
  tipo: UsuarioTipo;
  activo: boolean | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
}

export type UsuariosInsert = Omit<
  UsuariosRow,
  "created_at" | "updated_at" | "tipo" | "activo"
> & {
  tipo?: UsuarioTipo;
  activo?: boolean;
  created_at?: Timestamp | null;
  updated_at?: Timestamp | null;
};

export type UsuariosUpdate = Partial<UsuariosRow> & { id: UUID };

// encuestas
export interface EncuestasRow {
  id: UUID;
  titulo: string;
  descripcion: string;
  tipo: EncuestaTipo;
  opciones: any | null; // jsonb
  fecha_inicio: Timestamp;
  fecha_fin: Timestamp;
  activa: boolean | null;
  parroquia_destino: string | null;
  barrio_destino: string | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
}

export type EncuestasInsert = Omit<
  EncuestasRow,
  "id" | "created_at" | "updated_at" | "activa" | "opciones"
> & {
  id?: UUID;
  opciones?: any | null;
  activa?: boolean;
  parroquia_destino?: string | null;
  barrio_destino?: string | null;
  created_at?: Timestamp | null;
  updated_at?: Timestamp | null;
};

export type EncuestasUpdate = Partial<EncuestasRow> & { id: UUID };

// respuestas_encuestas
export interface RespuestasEncuestasRow {
  id: UUID;
  encuesta_id: UUID;
  usuario_id: UUID;
  respuesta: any; // jsonb
  created_at: Timestamp | null;
}

export type RespuestasEncuestasInsert = Omit<
  RespuestasEncuestasRow,
  "id" | "created_at"
> & {
  id?: UUID;
  created_at?: Timestamp | null;
};

export type RespuestasEncuestasUpdate = Partial<RespuestasEncuestasRow> & {
  id: UUID;
};

// noticias
export interface NoticiasRow {
  id: UUID;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  parroquia_destino: string | null;
  barrio_destino: string | null;
  administrador_id: UUID;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
}

export type NoticiasInsert = Omit<
  NoticiasRow,
  "id" | "created_at" | "updated_at"
> & {
  id?: UUID;
  imagen_url?: string | null;
  parroquia_destino?: string | null;
  barrio_destino?: string | null;
  created_at?: Timestamp | null;
  updated_at?: Timestamp | null;
};

export type NoticiasUpdate = Partial<NoticiasRow> & { id: UUID };

// reportes
export interface ReportesRow {
  id: UUID;
  usuario_id: UUID;
  categoria: ReporteCategoria;
  descripcion: string;
  ubicacion_parroquia: string;
  ubicacion_barrio: string;
  ubicacion_direccion: string;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  estado: ReporteEstado;
  prioridad: ReportePrioridad;
  imagen_url: string | null;
  respuesta_admin: string | null;
  fecha_resolucion: Timestamp | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
}

export type ReportesInsert = Omit<
  ReportesRow,
  "id" | "created_at" | "updated_at" | "estado" | "prioridad"
> & {
  id?: UUID;
  estado?: ReporteEstado;
  prioridad?: ReportePrioridad;
  imagen_url?: string | null;
  respuesta_admin?: string | null;
  fecha_resolucion?: Timestamp | null;
  created_at?: Timestamp | null;
  updated_at?: Timestamp | null;
};

export type ReportesUpdate = Partial<ReportesRow> & { id: UUID };

// Export general DB types (útil para supabase generics)
export interface Database {
  public: {
    Tables: {
      administradores: {
        Row: AdministradoresRow;
        Insert: AdministradoresInsert;
        Update: AdministradoresUpdate;
      };
      usuarios: {
        Row: UsuariosRow;
        Insert: UsuariosInsert;
        Update: UsuariosUpdate;
      };
      encuestas: {
        Row: EncuestasRow;
        Insert: EncuestasInsert;
        Update: EncuestasUpdate;
      };
      respuestas_encuestas: {
        Row: RespuestasEncuestasRow;
        Insert: RespuestasEncuestasInsert;
        Update: RespuestasEncuestasUpdate;
      };
      noticias: {
        Row: NoticiasRow;
        Insert: NoticiasInsert;
        Update: NoticiasUpdate;
      };
      reportes: {
        Row: ReportesRow;
        Insert: ReportesInsert;
        Update: ReportesUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
