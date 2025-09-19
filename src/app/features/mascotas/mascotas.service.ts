import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResultDto } from '../../shared/common.models';
import { CreateMascotaRequest, mascota, UpdateMascotaRequest } from './mascotas.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/mascotas';

  constructor() { }

  getMascotasPaged(page: number, pageSize: number, search: string): Observable<PagedResultDto<mascota>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }
    console.log(page, pageSize, search);
    return this.http.get<PagedResultDto<mascota>>(`${this.baseUrl}/paged`, { params });
  }

  getAll(): Observable<mascota[]> {
    return this.http.get<mascota[]>(this.baseUrl);
  }

  create(mascota: CreateMascotaRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, mascota);
  }

  update(id: string, mascota: UpdateMascotaRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, mascota);
  }
}
