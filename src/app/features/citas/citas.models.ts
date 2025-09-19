export interface ObtenerPorRangoFechaRequest {
  inicio_semana: Date
}

export interface obtenerPorRangoFechaResponse {
  id: string,
  mascota_id: string,
  nombre: string,
  servicio_id: string,
  servicio: string,
  profesional_id?: string,
  profesional?: string,
  fecha_hora_inicio: Date,
  fecha_hora_fin: Date,
  motivo?: string,
  estatus: string,
  observaciones?: string
}

export interface CreateCitaRequest {
  mascota_id: string,
  servicio_id: string,
  profesional_id?: string,
  fecha_hora_inicio: Date,
  fecha_hora_fin: Date,
  motivo?: string,
  observaciones?: string
}

export interface UpdateCitaRequest {
  servicio_id: string,
  profesional_id?: string,
  fecha_inicio: Date,
  fecha_final: Date,
  motivo?: string,
  observaciones?: string
}
