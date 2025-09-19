import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { obtenerPorRangoFechaResponse } from '../citas.models';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../../shared/servicio.service';
import { ObtenerServiciosResponse } from '../../../shared/service.models';
import { ProfesionalService } from '../../../shared/profesional.service';
import { ObtenerProfesionalesResponse } from '../../../shared/profesional.models';
import { MascotasService } from '../../mascotas/mascotas.service';
import { mascota } from '../../mascotas/mascotas.models';

@Component({
  selector: 'app-cita-modal-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cita-modal-form.component.html',
  styles: ``
})
export class CitaModalFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private servicioService = inject(ServicioService);
  private profesionalService = inject(ProfesionalService);
  private mascotasService = inject(MascotasService);

  @Input() cita: obtenerPorRangoFechaResponse | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() modalClose = new EventEmitter<void>();

  mascotas = signal<mascota[] | []>([]);
  servicios = signal<ObtenerServiciosResponse[] | []>([]);
  profesionales = signal<ObtenerProfesionalesResponse[] | []>([]);
  citaForm!: FormGroup;
  isEditMode = signal(false);

  ngOnInit(): void {
    this.citaForm = this.fb.group({
      id: [null],
      mascota_id: ['', Validators.required],
      nombre: [''],
      servicio_id: ['', Validators.required],
      servicio: [''],
      profesional_id: [''],
      profesional: [''],
      fecha_hora_inicio: [null, Validators.required],
      fecha_hora_fin: [null, Validators.required],
      motivo: [''],
      estatus: [''],
      observaciones: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cita'] && this.citaForm) {
      this.isEditMode.set(!!this.cita);

      this.citaForm.patchValue({
        id: this.cita?.id || null,
        mascota_id: this.cita?.mascota_id || '',
        nombre: this.cita?.nombre || '',
        servicio_id: this.cita?.servicio_id || '',
        servicio: this.cita?.servicio || '',
        profesional_id: this.cita?.profesional_id || '',
        profesional: this.cita?.profesional || '',
        fecha_hora_inicio: this.cita?.fecha_hora_inicio ?? null,
        fecha_hora_fin: this.cita?.fecha_hora_fin ?? null,
        motivo: this.cita?.motivo || '',
        estatus: this.cita?.estatus || '',
        observaciones: this.cita?.observaciones || ''
      });
    }

    this.loadMascotas();
    this.loadServicios();
    this.loadProfesionales();
  }

  loadMascotas() {
    this.mascotasService.getAll().subscribe({
      next: (data) => {
        this.mascotas.set(data);
      }
    })
  }

  loadServicios(): void {
    this.servicioService.getAllServices().subscribe({
      next: (data) => {
        this.servicios.set(data);
      }
    });
  }

  loadProfesionales(): void {
    this.profesionalService.getAllProfesionales().subscribe({
      next: (data) => {
        this.profesionales.set(data);
      }
    });
  }

  onSubmit(): void {
    console.log(this.citaForm.value);

    if (this.citaForm.valid) {
      const formValue = this.citaForm.value;
      const citaToSave = {
        id: formValue.id,
        mascota_id: formValue.mascota_id,
        servicio_id: formValue.servicio_id,
        profesional_id: formValue.profesional_id,
        fecha_hora_inicio: formValue.fecha_hora_inicio,
        fecha_hora_fin: formValue.fecha_hora_fin,
        motivo: formValue.motivo,
        observaciones: formValue.observaciones
      };
      this.formSubmit.emit({
        data: citaToSave,
        isEdit: this.isEditMode()
      });
    }
  }

  closeModal(): void {
    this.citaForm.reset();
    this.modalClose.emit();
  }
}
