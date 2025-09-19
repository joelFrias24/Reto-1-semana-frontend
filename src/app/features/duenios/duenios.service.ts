import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateDuenioRequest, DueniosPagedResponse, DueniosResponse, UpdateDuenioRequest, UpdateDuenioResponse } from './duenios.models';
import { PagedResultDto } from '../../shared/common.models';

@Injectable({
  providedIn: 'root'
})
export class DueniosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/duenios';

  constructor() { }

  getAll(): Observable<DueniosResponse[]>{
    return this.http.get<DueniosResponse[]>(this.baseUrl);
  }

  getAllPaged(page: number, pageSize: number): Observable<PagedResultDto<DueniosPagedResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    console.log(page, pageSize);
    return this.http.get<PagedResultDto<DueniosPagedResponse>>(`${this.baseUrl}/paged`, { params });
  }

  create(duenio: CreateDuenioRequest): Observable<DueniosResponse> {
    return this.http.post<DueniosResponse>(this.baseUrl, duenio);
  }

  update(id: string, duenio: UpdateDuenioRequest): Observable<UpdateDuenioResponse> {
    console.log(duenio);
    return this.http.put<UpdateDuenioResponse>(`${this.baseUrl}/${id}`, duenio);
  }

}
