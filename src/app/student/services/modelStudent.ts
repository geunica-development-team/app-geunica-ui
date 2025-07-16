// models.ts

/** Curso */
export interface Curso {
  id_curso: number;
  nombre: string;
  codigo: string;
  descripcion_curso: string;
}

/** Temas del plan de estudios */
export interface Curriculum {
  id: number;
  courseId: number;
  topic: string;
  description: string;
  teacher: string;
  date: string; // ISO YYYY-MM-DD
  imageUrl?: string;
}

export interface PersonaDocente {
  id_persona: number;
  nombres: string;
  apell_paterno: string;
}

export interface Docente {
  id_docente: number;
  especialidad: string;
  persona: PersonaDocente;
}

/** Examen */
export interface Examen {
  id_examen: number;
  courseId: number;
  id_ciclo: number;
  categoria: string;
  nombre_examen: string;
  fecha_examen: string; // ISO YYYY-MM-DD
  peso: number;
  estado_examen: 'activo' | 'anulado';
}

/** Nota de examen */
export interface NotaExamen {
  id_nota: number;
  id_examen: number;
  id_matricula: number;
  valor: number;
  estado_nota: 'activa' | 'anulada';
  fecha_registro: string; // ISO YYYY-MM-DD
}

/** Actividad o tarea */
export interface Actividad {
  id_actividad: number;
  id_asignacion_de_clase: number;
  nombre_tarea: string;
  peso: number;
}

/** Nota de actividad */
export interface NotaActividad {
  id_nota_actividad: number;
  id_actividad: number;
  id_matricula: number;
  valor: number;
}

/** Anuncio */
export interface Anuncio {
  id_anuncio: number;
  titulo: string;
  estado: 'visto' | 'publicado';
  cuerpo: string;
  creado_por: string;
  fecha_creacion: string; // ISO 8601, e.g. "2025-07-02T09:00:00Z"
  
}

/** Registro plano de asistencia */
export interface FlatAsistencia {
  id_asistencia: number;
  id_estudiante: number;
  status: 'asistió' | 'faltó' | 'tardanza';
  date: string;
}

/** Sesión de asistencia */
export interface Session {
  date: string;
  status: 'asistió' | 'faltó' | 'tardanza';
}

/** Mes de asistencia */
export interface Month {
  month: string;
  sessions: Session[];
}

/** Asistencia agrupada por meses */
export interface Attendance {
  [x: string]: any;
  startDate: string;
  endDate: string;
  months: Month[];
}
