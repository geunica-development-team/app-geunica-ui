export const menuItemsStudent = [
    { 
      icon: 'fas fa-home', 
      label: 'Dashboard', 
      route: '/dashboard',
      active: true 
    },
    { 
      icon: 'fas fa-chart-bar', 
      label: 'Mis cursos', 
      route: '/cursos' 
    },
    { 
      icon: 'fas fa-sticky-note', 
      label: 'Notas', 
      route: '/notas' 
    },
    { 
      icon: 'fas fa-clock', 
      label: 'Asistencia', 
      route: '/asistencia' 
    },
    { 
      icon: 'fas fa-bullhorn', 
      label: 'Anuncios', 
      route: '/anuncios',
      badge: 24 
    },
    { 
      icon: 'fas fa-calendar-alt', 
      label: 'Cronograma', 
      route: '/cronograma' 
    }
];

export const menuItemsAdmin = [
    { 
      icon: 'fas fa-home', 
      label: 'Dashboard', 
      route: '/admin/panel/dashboard',
      active: true 
    },
    { 
      icon: 'fa-solid fa-users', 
      label: 'Usuarios', 
      route: '/admin/panel/usuarios' 
    },
    { 
      icon: 'fa-solid fa-school', 
      label: 'Gestión Académica', 
      route: '/admin/panel/gestion-academica' 
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
    }
];

export const generalItems = [
    { 
      icon: 'fas fa-cog', 
      label: 'Configuración', 
      route: '/configuracion' 
    },
  ];
