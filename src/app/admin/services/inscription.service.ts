import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

//OJO, EN EL BACKEND "INSCRIPCION" ES INSCRIPTION,
//EN EL FRONTEND "INSCRIPCION" ES ENROLLMENT

export interface dataInscription {
    student: {
        person: dataPerson;
    };
    tutor: {
        person: dataPerson;
        relation: string;
    };
    inscription: {
        idGrade: number;
    };
}

export interface dataPerson {
    names: string;
    paternalSurname: string;
    maternalSurname: string;
    typeOfIdentityDocument: string;
    documentNumber: string;
    birthDate: string; // formato ISO: YYYY-MM-DD
    gender: string;
    address: string;
    phoneNumber: string;
    email: string;
}

export interface dataInscriptionbyId extends dataInscription {
    id: number;
    registrationDate: string;
    state: string;
    level: {
        id: number;
        name: string;
    }
    grade: {
        id: number;
        name: string;
    };
}

export interface dataInscriptionAll {
    id: number;
    registrationDate: string;
    state: string;
    student: {
        person: {
            names: string,
            paternalSurname: string;
            maternalSurname: string;
            documentNumber: string;
        }
    };
    tutor: {
        person: {
            names: string,
            paternalSurname: string;
            maternalSurname: string;
        }
    };
    grade: {
        id: number;
        name: string;
        level: {
            id: number;
            name: string;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class InscriptionService {
    private httpService = inject(HttpClient);
    private auth_end_point = 'https://app-geunica-backend.onrender.com';
    constructor() {}
    
    // Función para manejar errores
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Error desconocido';
        
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            const backend = error.error;
            
            switch (backend.message) {
                case "Sede no encontrada":
                    errorMessage = backend.message;
                    break;
                case "Contraseña incorrecta":
                    errorMessage = backend.message;
                    break;
                    default:
                        errorMessage = backend.message || 'Error interno del servidor';
                        break;
                    }
        }
        return throwError(() => new Error(errorMessage));
    }
                
    addInscription(data: dataInscription) {
        return this.httpService
        .post(this.auth_end_point+'/inscription/full', {...data})
        .pipe(catchError(this.handleError)
        );
    }
    getAllInscriptions() {
        return this.httpService
        .get<dataInscriptionAll[]>(this.auth_end_point+'/inscription')
        .pipe(catchError(this.handleError)
        );
    }
    getInscriptionById(id:number) {
        return this.httpService
        .get<dataInscriptionbyId>(`${this.auth_end_point}/inscription/${id}`)
        .pipe(catchError(this.handleError));
    }
    updateInscription(id: number, data: dataInscription) {
        return this.httpService
        .patch(`${this.auth_end_point}/inscription/${id}`, { ...data})
        .pipe(catchError(this.handleError));
    }
}
            

        