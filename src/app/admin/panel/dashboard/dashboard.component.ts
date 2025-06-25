import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/dashboard/header/header.component';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";

@Component({
  selector: 'app-dashboard',
  imports: [PanelHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Información de la escuela
  schoolName: string = 'GEUNICA';
  
  // Estadísticas de estudiantes
  totalStudents: number = 5909;
  malePercentage: number = 53;
  femalePercentage: number = 47;
  maleCount: number = 3178;
  femaleCount: number = 2731;
  
  // Personal
  teacherCount: number = 60;
  employeeCount: number = 100;
  
  // Calendario
  currentMonth: string = 'Septiembre 2021';
  currentDay: number = 19;
  daysOfWeek: string[] = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  calendarDays: number[] = Array.from({length: 30}, (_, i) => i + 1);
  
  // Finanzas
  totalIncome: number = 29545000;
  totalExpenses: number = 19291266;
  incomeGrowth: number = 12;
  expensesGrowth: number = 5.5;
  
  // Estado de pagos
  paidFees: number = 1335;
  pendingFees: number = 4366;
  overdueFees: number = 208;
  
  // Tablón de anuncios
  announcements: any[] = [
    {
      title: 'Día Deportivo Anual',
      description: 'El Día Deportivo Anual se llevará a cabo el 12 de mayo de 2024. ¡Marca tu calendario!',
      type: 'event',
      icon: 'fas fa-trophy'
    },
    {
      title: 'Inicio de Vacaciones de Verano',
      description: 'Las vacaciones de verano comienzan el 25 de mayo de 2024. ¡Disfruten de unas maravillosas vacaciones!',
      type: 'info',
      icon: 'fas fa-sun'
    }
  ];
  
  // Mensajes
  messages: any[] = [
    {
      name: 'Carmen Rodríguez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      message: '¿Podemos hablar del rendimiento de mi hijo?',
      time: '12:34 pm'
    },
    {
      name: 'Cristina Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      message: '¿Tendremos examen de matemáticas esta semana?',
      time: '12:34 pm'
    },
    {
      name: 'Juana Vega',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      message: '¡Hola!',
      time: '12:34 pm'
    },
    {
      name: 'Beatriz Sánchez',
      avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
      message: '¿Podemos revisar mi último trabajo?',
      time: '12:34 pm'
    },
    {
      name: 'Daniel Estrada',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      message: '¿Podemos reunirnos mañana?',
      time: '12:34 pm'
    }
  ];
  
  // Datos del gráfico de ingresos
  chartData = {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    income: [500000, 750000, 600000, 800000, 950000, 700000, 650000, 800000, 900000, 950000, 1000000, 1100000],
    expenses: [300000, 400000, 350000, 450000, 500000, 400000, 350000, 450000, 500000, 550000, 600000, 650000]
  };
  
  selectedYear: string = '2023-2024';
  selectedPeriod: string = 'Anual';
  selectedFeePeriod: string = 'Anual';
  
  constructor() { }
  
  ngOnInit(): void {
    // Inicialización del componente
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  }
  
  formatNumber(num: number): string {
    return new Intl.NumberFormat('es-ES').format(num);
  }
  
  getAnnouncementClass(type: string): string {
    switch (type) {
      case 'event': return 'announcement-event';
      case 'info': return 'announcement-info';
      default: return 'announcement-default';
    }
  }
}
