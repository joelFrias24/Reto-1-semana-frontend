import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ObtenerServiciosResponse } from './service.models';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/servicios';

  constructor() { }

  getAllServices(): Observable<ObtenerServiciosResponse[]>{
    return this.http.get<ObtenerServiciosResponse[]>(this.baseUrl);
  }
}
