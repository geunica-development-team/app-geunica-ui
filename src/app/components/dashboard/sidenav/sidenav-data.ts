export const menuItemsStudent = [
    { 
      icon: 'fas fa-home', 
      label: 'Dashboard', 
      route: 'dashboard',
      active: true 
    },
    { 
      icon: 'fas fa-chart-bar', 
      label: 'Mis cursos', 
      route: 'courses',
      active: true
    },
    { 
      icon: 'fas fa-sticky-note', 
      label: 'Mis notas', 
      route: 'grades' 
    },
    { 
      icon: 'fas fa-solid fa-money-bill-wave', 
      label: 'Pagos', 
      route: 'payments' 
    },
    { 
      icon: 'fas fa-clock', 
      label: 'Asistencia', 
      route: 'attendance' 
    },
    { 
      icon: 'fas fa-bullhorn', 
      label: 'Anuncios', 
      route: 'announcement',
      badge: 24 
    },
    { 
      icon: 'fas fa-calendar-alt', 
      label: 'Horario', 
      route: 'schedule' 
    }
];

export const menuItemsTeacher = [
    { 
      icon: 'fas fa-home', 
      label: 'Dashboard', 
      route: 'dashboard',
      active: true 
    },
    { 
      icon: 'fas fa-chart-bar', 
      label: 'Cursos Asignados', 
      route: 'coursesAsigned' 
    },
    { 
      icon: 'fas fa-sticky-note', 
      label: 'Gestion de Notas', 
      route: 'NoteManagment' 
    },
    { 
      icon: 'fas fa-clock', 
      label: 'Gestion de asistencias', 
      route: 'attendanceManagment',
      badge: 24 
    },
    { 
      icon: 'fas fa-bullhorn', 
      label: 'Anuncios', 
      route: 'announcement' 
    },
        { 
      icon: 'fas fa-calendar-alt', 
      label: 'Horario', 
      route: 'schedule' 
    }
];

export const menuItemsAdmin = [
    { 
      icon: 'fas fa-home', 
      label: 'Dashboard', 
      route: 'dashboard',
      active: true 
    },
    {
      icon: 'fa-solid fa-file-circle-plus', 
      label: 'Inscripciones', 
      route: 'inscripciones',
      active: true 
    },
    {
      icon: 'fa-solid fa-users', 
      label: 'Gestión de estudiantes', 
      route: 'estudiantes-matriculados',
      active: true 
    },
    {
      icon: 'fa-solid fa-person-chalkboard', 
      label: 'Gestión de equipo académico', 
      route: 'equipo-academico',
      active: true 
    },
    { 
      icon: 'fa-solid fa-users', 
      label: 'Usuarios', 
      route: '/admin/panel/usuarios' 
    },
    { 
      icon: 'fa-solid fa-people-roof', 
      label: 'Salones', 
      route: '/admin/panel/aulas' 
    },
    { 
      icon: 'fa-solid fa-calendar', 
      label: 'Horarios', 
      route: '/admin/panel/horarios' 
    },
    { 
      icon: 'fa-solid fa-coins', 
      label: 'Finanzas', 
      route: '/admin/panel/finanzas' 
    },
    { 
      icon: 'fas fa-bullhorn', 
      label: 'Anuncios', 
      route: '/admin/panel/anuncios',
      badge: 24 
    },
    { 
      icon: 'fas fa-cog', 
      label: 'Configuración académica', 
      route: 'academic-configuration' 
    }
];

export const menuItemsSecretary = [
  { 
    icon: 'fas fa-home', 
    label: 'Dashboard', 
    route: '/admin/panel/dashboard',
    active: true 
  },
  {
    icon: 'fa-solid fa-file-circle-plus', 
    label: 'Inscripciones', 
    route: '/admin/panel/inscripciones',
    active: true 
  },
  {
    icon: 'fa-solid fa-users', 
    label: 'Gestión de estudiantes', 
    route: '/admin/panel/estudiantes-matriculados',
    active: true 
  },
  {
    icon: 'fa-solid fa-person-chalkboard', 
    label: 'Gestión de equipo académico', 
    route: '/admin/panel/equipo-academico',
    active: true 
  },
  { 
    icon: 'fa-solid fa-people-roof', 
    label: 'Aulas', 
    route: '/admin/panel/aulas' 
  },
  { 
    icon: 'fa-solid fa-calendar', 
    label: 'Horarios', 
    route: '/admin/panel/horarios' 
  },
  { 
    icon: 'fa-solid fa-book', 
    label: 'Cursos', 
    route: '/admin/panel/cursos' 
  },
  { 
    icon: 'fas fa-bullhorn', 
    label: 'Anuncios', 
    route: '/admin/panel/anuncios',
    badge: 24 
  }
]

export const generalItems = [
    { 
      icon: 'fas fa-cog', 
      label: 'Configuración', 
      route: '/configuracion' 
    },
        { 
      icon: 'fas fa-cog', 
      label: 'Salir', 
      route: '/configuracion' 
    },
  ];
