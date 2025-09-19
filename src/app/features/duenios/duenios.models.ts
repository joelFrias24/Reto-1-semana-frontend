export interface DueniosResponse {
  id: string,
  nombre_completo: string,
  num_identificacion: string,
  direccion?: string,
  telefono?: string,
  correo?: string
}

export interface DueniosPagedResponse {
  id: string,
  nombre_completo: string,
  num_identificacion: string,
  direccion?: string,
  telefono?: string,
  correo?: string,
  mascotas: MascotaDueniosResponse[]
}

export interface MascotaDueniosResponse {
  id: string,
  nombre: string
}

export interface CreateDuenioRequest {
  nombre_completo: string,
  num_identificacion: string,
  direccion?: string,
  telefono?: string,
  correo?: string
}

export interface UpdateDuenioRequest {
  nombre_completo: string,
  num_identificacion: string,
  direccion?: string,
  telefono?: string,
  correo?: string
}

export interface UpdateDuenioResponse {
  id: string
}
