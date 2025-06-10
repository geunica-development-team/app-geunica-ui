export const menuItems = [
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

export const generalItems = [
    { 
      icon: 'fas fa-cog', 
      label: 'Configuración', 
      route: '/configuracion' 
    },
    { 
      icon: 'fas fa-sign-out-alt', 
      label: 'Cerrar sesión', 
      action: 'logout' 
    }
  ];
