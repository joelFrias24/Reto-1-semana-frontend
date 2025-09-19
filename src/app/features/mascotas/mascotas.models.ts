export interface mascota {
  id: string,
  nombre: string,
  especie: string,
  raza: string,
  fecha_nacimiento?: Date,
  sexo: string,
  color?: string,
  peso?: number,
  notas?: string,
  duenio_id: string,
  duenio: string
}

export interface CreateMascotaRequest {
  nombre: string,
  especie: string,
  raza: string,
  fecha_nacimiento?: Date,
  sexo: string,
  color?: string,
  peso?: number,
  notas?: string,
  duenio_id: string
}

export interface UpdateMascotaRequest {
  nombre: string,
  especie: string,
  raza: string,
  fecha_nacimiento?: Date,
  sexo: string,
  color?: string,
  peso?: number,
  notas?: string,
  duenio_id: string
}
