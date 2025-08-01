import { Component, inject, ViewChild } from '@angular/core';
import { PanelHeaderComponent } from "../../../components/dashboard/shared-components/panel-header/panel-header.component";
import { TableComponent } from '../../../components/table/table.component';
import { ModalAddClassroomComponent } from './modal-add-classroom/modal-add-classroom.component';
import { ModalEditClassroomComponent } from "./modal-edit-classroom/modal-edit-classroom.component";
import { ModalDeleteClassroomComponent } from "./modal-delete-classroom/modal-delete-classroom.component";
import { environment } from '../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-classrooms',
  imports: [PanelHeaderComponent, TableComponent, ModalAddClassroomComponent, ModalEditClassroomComponent, ModalDeleteClassroomComponent],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css'
})
export class ClassroomsComponent {
  private http = inject(HttpClient);
  private BaseUrl = environment.apiBase;

  @ViewChild('classroomTable') classroomTable?: TableComponent;
  @ViewChild('modalAdd')    modalAddClassroom!:    ModalAddClassroomComponent;
  @ViewChild('modalEdit')   modalEdit!:   ModalEditClassroomComponent;
  @ViewChild('modalDelete') modalDelete!: ModalDeleteClassroomComponent;

  // columnas
  columns = [
    'ID','Nombre','Periodo','Estado',
    'Sede','Nivel','Grado y Sección',
    'Turno','Capacidad'
  ];
  columnMappings = {
    'ID':'id','Nombre':'name','Periodo':'period',
    'Estado':'state','Sede':'campus','Nivel':'level',
    'Grado y Sección':'gradeAndSection','Turno':'shift',
    'Capacidad':'capacityDisplay'
  };

  rows: any[] = [];

  ngOnInit() {
    this.loadClassrooms();
  }

  loadClassrooms() {
    this.http.get<any[]>(`${this.BaseUrl}/classrooms`)
      .subscribe(aulas => {
        this.rows = aulas.map(a => ({
          id:               a.id,
          name:             a.name,
          period:           a.period?.name ?? '—',
          state:            a.state ?? '—',
          stateClass:       a.state === 'En curso' ? 'badge bg-success-subtle text-success fw-semibold'
                            : a.state === 'Finalizado' ? 'badge bg-danger-subtle text-danger fw-semibold'
                            : 'badge bg-secondary-subtle text-secondary fw-semibold',
          campus:           a.campus?.name ?? '—',
          level:            a.grade?.level?.name ?? '—',
          gradeAndSection:  `${a.grade?.name ?? ''} - ${a.section?.name ?? ''}`.trim(),
          shift:            a.shift,
          capacityDisplay:  `0/${a.capacity} | 0/${a.specialCapacity}`
        }));
        this.classroomTable?.updateTable();
      }, err => console.error('Error cargando aulas', err));
  }

  applyFilter(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    if (this.classroomTable) {
      this.classroomTable.filterValue = v;
      this.classroomTable.updateTable();
    }
  }

  /** Abrir modal “Agregar” */
  openModalAdd(): void {
    this.modalAddClassroom.openModal();
  }

  /** Abrir modal “Editar” */
  openModalEdit(row: any) {
    if (!isNaN(+row.id)) {
      this.modalEdit.rowId = +row.id;
      this.modalEdit.openModal();
    }
  }

  /** Abrir modal “Eliminar” */
  openModalDelete(row: any): void {
    if (!isNaN(+row.id)) {
      this.modalDelete.rowId = +row.id;
      this.modalDelete.openModal();
    }
  }

  onCreatedOrEditedOrDeleted() {
    this.loadClassrooms();
  }
}
