import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CreateCitaRequest, ObtenerPorRangoFechaRequest, obtenerPorRangoFechaResponse, UpdateCitaRequest } from './citas.models';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/citas';

  constructor() { }

  getCitasPorRangoDeFecha(request: Date): Observable<obtenerPorRangoFechaResponse[]> {
    const params = new HttpParams()
      .set('fecha_inicio', request.toISOString());
    return this.http.get<obtenerPorRangoFechaResponse[]>(`${this.baseUrl}/week`, { params });
  }

  create(cita: CreateCitaRequest): Observable<string> {
    console.log(cita);
    return this.http.post<string>(this.baseUrl, cita);
  }

  update(id: string, cita: UpdateCitaRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, cita);
  }

}
