import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'https://app-geunica-backend.onrender.com/teacher'; // Ajusta tu URL

  constructor(private http: HttpClient) {}

  getMyAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me/assignments`);
  }

  getAssignmentById(assignmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me/assignment/${assignmentId}`);
  }

  getStudentsInAssignment(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me/assignment/${assignmentId}/students`);
  }

  getGrades(assignmentId: number, enrollmentId: number, filters?: any): Observable<any> {
    let url = `${this.apiUrl}/assignment/${assignmentId}/student/${enrollmentId}/grades`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.periodType) params.append('periodType', filters.periodType);
      if (filters.periodNumber) params.append('periodNumber', filters.periodNumber.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<any>(url);
  }
}