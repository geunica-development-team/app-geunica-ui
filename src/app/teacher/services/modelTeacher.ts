// src/app/services/modelTeacher.ts

export interface Sede {
  id_sede: number;
  nombre: string;
  localizacion: string;
}

export interface Nivel {
  id_nivel: number;
  nombre: string;
}

export interface Grado {
  id_grado: number;
  nombre: string;
  id_nivel: number;
}

export interface Seccion {
  id_seccion: number;
  nombre: string;
}

export interface Salon {
  id_salon: number;
  id_sede: number;
  id_grado: number;
  id_seccion: number;
  nombre: string;
  turno: 'mañana' | 'tarde';
  capacidad: number;
}

export interface Curso {
  id_curso: number;
  nombre: string;
  codigo: string;
  descripcion_curso: string;
}

export interface Curriculum {
  id: number;
  id_curso: number;
  topic: string;
  description: string;
}

export interface Anuncio {
  id_anuncio: number;
  id_usuario: number;
  id_salon: number;
  titulo: string;
  cuerpo: string;
  estado: 'visto' | 'publicado' ;
  fecha_creacion: Date;
}

export interface Examen {
  id_examen: number;
  id_asignacion_de_clase: number;
  nombre_examen: string;
  peso: number;
}

export interface NotaExamen {
  id_nota_examen: number;
  id_examen: number;
  id_matricula: number;
  valor: number;
}

export interface Actividad {
  id_actividad: number;
  id_asignacion_de_clase: number;
  nombre_tarea: string;
  peso: number;
}

export interface NotaActividad {
  id_nota_actividad: number;
  id_actividad: number;
  id_matricula: number;
  valor: number;
}

export interface Asistencia {
  id_asistencia: number;
  id_estudiante: number;
  status: 'asistió' | 'faltó' | 'tardanza';
  date: string;
}

export interface Persona {
  id_persona: number;
  nombres: string;
  apell_paterno: string;
  correo: string;
}

export interface Docente {
  id_docente: number;
  id_persona: number;
  especialidad: string;
}

export interface Estudiante {
  id_estudiante: number;
  id_persona: number;
  id_usuario: number;
  codigo_estudiante: string;
  fecha_ingreso: string;
  estado: string;
}
