// src/app/services/dataTeacher.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';



@Injectable({
  providedIn: 'root'
})
export class DataTeacherService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}}