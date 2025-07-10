import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearcherComponent } from '../../../components/searcher/searcher.component';
import { DataService } from '../../../student/services/dataStudent.service';

@Component({
  selector: 'app-note-managment',
  imports: [CommonModule, SearcherComponent],
  templateUrl: './note-managment.component.html',
  styleUrl: './note-managment.component.css'
})
export class NoteManagmentComponent {
  //filteredCourses: Course[] = [];
  searchTerm: string = '';

  constructor(private dataSvc: DataService) {}

  ngOnInit() {
   
  }

    onSearch() {
    // opcional: aquí podrías disparar algún otro efecto al hacer submit,
    // pero el filtrado ya lo maneja el (filtered)
  }
}
