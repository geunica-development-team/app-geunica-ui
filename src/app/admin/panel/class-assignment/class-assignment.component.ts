import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from '../../../components/dashboard/shared-components/panel-header/panel-header.component';
import { MenuTabsComponent, TabItem } from '../../../components/dashboard/menu-tabs/menu-tabs.component';
import { environment } from '../../../../enviroments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalEditComponent } from '../academic-setting/modals/modal-edit/modal-edit.component';
import { ModalDeleteComponent } from '../academic-setting/modals/modal-delete/modal-delete.component';
import { ModalAddComponent } from '../academic-setting/modals/modal-add/modal-add.component';
import { TableComponent } from '../../../components/table/table.component';

@Component({
  selector: 'app-class-assignment',
  imports: [PanelHeaderComponent, MenuTabsComponent, ModalDeleteComponent, ModalEditComponent, ModalAddComponent, TableComponent],
  templateUrl: './class-assignment.component.html',
  styleUrl: './class-assignment.component.css'
})
export class ClassAssignmentComponent {
  private http     = inject(HttpClient);
  private route    = inject(ActivatedRoute);
  private router   = inject(Router);
  private baseUrl  = environment.apiBase;

    tabs: TabItem[] = [
      { id: "lunes", label: "Lunes", icon: "fa-solid fa-calendar"},
      { id: "martes", label: "Martes", icon: "fa-solid fa-calendar"},
      { id: "miercoles", label: "Miercoles", icon: "fa-solid fa-calendar" },
      { id: "jueves", label: "Jueves", icon: "fa-solid fa-calendar" },
      { id: "viernes", label: "Viernes", icon: "fa-solid fa-calendar" },
      { id: "sabado", label: "Sabado", icon: "fa-solid fa-calendar" },
      { id: "domingo", label: "Domingo", icon: "fa-solid fa-calendar" }
    ];

    activeTab = "lunes";

     // Cambiar tab activo
  setActiveTab(tabId: string) {
    this.activeTab = tabId
    // Actualizar URL con query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: "merge",
    })
  }

    ngOnInit() {
    this.loadLunes();
    this.loadMartes();
    this.loadMiercoles();
    this.loadJueves();
    this.loadViernes();
  }

  //Lunes
  @ViewChild('LunesTable') lunesTable?: TableComponent;
  columnsLunes = ['ID','Nombre','Curso','Docente','Inicio','Fin'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsLunes = {'ID': 'id','Nombre': 'name','Curso': 'course'
    ,'Docente': 'teacher','Inicio':'start_date','Fin':'end_date'
  };
  rowsLunes: any[] = [];
  loadLunes() {}


  //Martes
  @ViewChild('MartesTable') martesTable?: TableComponent;
  columnsMartes = ['ID','Nombre','Curso','Docente','Inicio','Fin'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsMartes = {'ID': 'id','Nombre': 'name','Curso': 'course'
    ,'Docente': 'teacher','Inicio':'start_date','Fin':'end_date'
  };
  rowsMartes: any[] = [];
  loadMartes() {}

  //Miercoles
  @ViewChild('MiercolesTable') miercolesTable?: TableComponent;
  columnsMiercoles = ['ID','Nombre','Curso','Docente','Inicio','Fin'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsMiercoles = {'ID': 'id','Nombre': 'name','Curso': 'course'
    ,'Docente': 'teacher','Inicio':'start_date','Fin':'end_date'
  };
  rowsMiercoles: any[] = [];
  loadMiercoles() {}

  //Jueves
  @ViewChild('JuevesTable') juevesTable?: TableComponent;
  columnsJueves = ['ID','Nombre','Curso','Docente','Inicio','Fin'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsJueves = {'ID': 'id','Nombre': 'name','Curso': 'course'
    ,'Docente': 'teacher','Inicio':'start_date','Fin':'end_date'
  };
  rowsJueves: any[] = [];
  loadJueves() {}


  //Viernes
  @ViewChild('ViernesTable') viernesTable?: TableComponent;
  columnsViernes = ['ID','Nombre','Curso','Docente','Inicio','Fin'];
  // MAPEO PARA COLUMNAS Y FILAS
  columnMappingsViernes = {'ID': 'id','Nombre': 'name','Curso': 'course'
    ,'Docente': 'teacher','Inicio':'start_date','Fin':'end_date'
  };
  rowsViernes: any[] = [];
  loadViernes() {}


    //––– Acciones editar / borrar (idénticas para todas)
  @ViewChild('modalEdit') modalEdit!: ModalEditComponent;
  @ViewChild('modalDelete') modalDelete!: ModalDeleteComponent;
  openModalEdit(row: any) {
    if (!isNaN(+row.id)) {
      this.modalEdit.rowId = +row.id;
      this.modalEdit.openModal();
    }
  }

  openModalDelete(row: any) {
    if (!isNaN(+row.id)) {
      this.modalDelete.rowId = +row.id;
      this.modalDelete.openModal();
    }
  }

  //PARA EL FILTRO DE LA TABLA (BUSCADOR)
  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (this.lunesTable   && this.activeTab==='lunes')    { this.lunesTable.filterValue   = val; this.lunesTable.updateTable(); }
    if (this.martesTable   && this.activeTab==='martes')  { this.martesTable.filterValue   = val; this.martesTable.updateTable(); }
    if (this.miercolesTable   && this.activeTab==='miercoles')   { this.miercolesTable.filterValue   = val; this.miercolesTable.updateTable(); }
    if (this.juevesTable && this.activeTab==='jueves'){ this.juevesTable.filterValue = val; this.juevesTable.updateTable(); }
    if (this.viernesTable  && this.activeTab==='viernes') { this.viernesTable.filterValue  = val; this.viernesTable.updateTable(); }
    
  }

  onCreatedOrEditedOrDeleted() {
    switch (this.activeTab) {
      case 'lunes':     this.loadLunes();   break;
      case 'martes':   this.loadMartes();   break;
      case 'miercoles':    this.loadMiercoles();   break;
      case 'jueves': this.loadJueves(); break;
      case 'viernes':  this.loadViernes();  break;
    }
  }

}
