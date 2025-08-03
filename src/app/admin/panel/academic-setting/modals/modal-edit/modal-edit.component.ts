import { Component, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css'
})
export class ModalEditComponent {
  //@Input({ required: true }) activeTab!: 'sedes'|'niveles'|'grados'|'secciones'|'periodos';
  @Input({ required: true })
  activeTab!: string;
  @Input() rowId!: number;
  @Output() updated = new EventEmitter<void>();

  private http = inject(HttpClient);
  private toolsForm   = inject(FormBuilder);
  private notification = inject(ToastrService);
  private modalService = inject(NgbModal);
  private baseUrl = environment.apiBase;
  
  @ViewChild('modalEdit') modalEdit!: TemplateRef<ElementRef>;  

  levels: any[] = [];
  // Forms para cada entidad
  formCampus   = this.toolsForm.group({ name: ['', Validators.required], location: ['', Validators.required] });
  formLevel    = this.toolsForm.group({ name: ['', Validators.required], cost: ['', Validators.required] });
  formGrade    = this.toolsForm.group({ name: ['', Validators.required], levelName: [0, Validators.required] });
  formSection  = this.toolsForm.group({ name: ['', Validators.required] });
  formPeriod   = this.toolsForm.group({
    name: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date:   ['', Validators.required],
    state:      [false, Validators.required],
  });
  formCourse   = this.toolsForm.group({ name: ['', Validators.required], 
    code: ['', Validators.required],
    description: ['', Validators.required]
   })

  ngOnInit() {     
    this.http.get<any[]>(`${this.baseUrl}/level`)
      .subscribe(data => this.levels = data); 
  }

  openModal() {
    this.modalService.open(this.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
    // cargar datos según entidad
    switch (this.activeTab) {
      case 'sedes':     this.loadAndPatch('campus', this.formCampus, ['name','location']); break;
      case 'niveles':   this.loadAndPatch('level',  this.formLevel,  ['name','cost']);     break;
      case 'grados':
        this.http.get<any>(`${this.baseUrl}/grade/${this.rowId}`)
          .subscribe({
            next: grade => {
              this.formGrade.patchValue({
                name:      grade.name,
                levelName: grade.level.name   // <–– asegúrate de esto
              });
            },
            error: () => this.notification.error('Error cargando grado','Error')
          });
      break;
      case 'secciones': this.loadAndPatch('section',this.formSection,['name']);          break;
      case 'periodos':
        this.http.get<any>(`${this.baseUrl}/period/${this.rowId}`)
          .subscribe({
            next: period => {
              this.formPeriod.patchValue({
                name:       period.name,
                start_date: period.start_date,
                end_date:   period.end_date,
                // convierte string -> boolean
                state:      period.state === 'active'
              });
            },
            error: () => this.notification.error('Error cargando detalles del periodo', 'Error')
          });
        break;
        case 'cursos': this.loadAndPatch('course',this.formCourse,['name','code','description']); break;
    }
  }

  loadAndPatch(endpoint: string, form: any, fields: string[]) {
    this.http.get<any>(`${this.baseUrl}/${endpoint}/${this.rowId}`)
      .subscribe({
        next: data => {
          const patch: any = {};
          for (const f of fields) {
            patch[f] = data[f];
          }
          form.patchValue(patch);
        },
        error: () => this.notification.error(`Error cargando detalles de ${endpoint}`, 'Error')
      });
  }

  getTitle(): string {
    switch (this.activeTab) {
      case 'sedes': return 'Editar sede';
      case 'niveles': return 'Editar nivel/programa';
      case 'grados': return 'Editar grado';
      case 'secciones': return 'Editar sección';
      case 'periodos':  return 'Editar periodo';
      case 'cursos':  return 'Editar curso';
      default: return 'Editar';
    }
  }

onSave() {
  let endpoint = '';
  let form: FormGroup;

  switch (this.activeTab) {
    case 'sedes':
      endpoint = 'campus';    form = this.formCampus;   break;
    case 'niveles':
      endpoint = 'level';     form = this.formLevel;    break;
    case 'grados':
      endpoint = 'grade';     form = this.formGrade;    break;
    case 'secciones':
      endpoint = 'section';   form = this.formSection;  break;
    case 'periodos':
      endpoint = 'period';    form = this.formPeriod;   break;
    case 'cursos':
      endpoint = 'course';    form = this.formCourse;   break;
    default:
      return;
  }

  if (form.invalid) {
    this.notification.error('Debes completar todos los campos correctamente', 'Error');
    return;
  }

  // toma los valores
  const body: any = { ...form.value };

  // Si es periodo, convertimos el boolean a string y renombramos si es necesario
  if (endpoint === 'period') {
    // tu API espera start_date y end_date
    body.start_date = body.start_date;
    body.end_date   = body.end_date;
    // convierte booleano a la cadena que espera tu DTO
    body.state = body.state ? 'En curso' : 'Finalizado';
  }

  this.http.patch(
    `${this.baseUrl}/${endpoint}/${this.rowId}`,
    body
  ).subscribe({
    next: () => {
      this.notification.success(`${this.getTitle()} exitoso.`, 'Éxito');
      this.updated.emit();
      this.modalService.dismissAll();
      form.reset({ state: null });
    },
    error: err => {
      const msg = err.error?.message || err.message || 'Error';
      this.notification.error(msg, 'Error');
    }
  });
}

  onCancel() {
    this.modalService.dismissAll();
    // reset de todos
    this.formCampus.reset();
    this.formLevel.reset();
    this.formGrade.reset();
    this.formSection.reset();
    this.formPeriod.reset({ state: null });
    this.formCourse.reset();
  }
}