import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ObtenerProfesionalesResponse } from './profesional.models';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/profesionales';

  constructor() { }

  getAllProfesionales(): Observable<ObtenerProfesionalesResponse[]>{
    return this.http.get<ObtenerProfesionalesResponse[]>(this.baseUrl);
  }
}
