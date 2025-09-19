import { Component, EventEmitter, inject, Input, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { mascota } from '../mascotas.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DueniosResponse } from '../../duenios/duenios.models';
import { DueniosService } from '../../duenios/duenios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mascota-modal-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mascota-modal-form.component.html',
  styles: ``
})
export class MascotaModalFormComponent implements OnInit {
  private dueñosService = inject(DueniosService);
  private fb = inject(FormBuilder);

  @Input() mascota: mascota | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() modalClose = new EventEmitter<void>();

  duenios = signal<DueniosResponse[] | []>([]);
  mascotaForm!: FormGroup;
  isEditMode = signal(false);

  ngOnInit(): void {
    // Aquí inicializas el formulario para que no sea 'undefined' al inicio
    this.mascotaForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
      sexo: ['', Validators.required],
      color: [''],
      peso: [null],
      notas: [''],
      duenio_id: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascota'] && this.mascotaForm) {
      this.isEditMode.set(!!this.mascota);

      this.mascotaForm.patchValue({
        id: this.mascota?.id || null,
        especie: this.mascota?.especie || '',
        nombre: this.mascota?.nombre || '',
        raza: this.mascota?.raza || '',
        fecha_nacimiento: this.mascota?.fecha_nacimiento ?? null,
        sexo: this.mascota?.sexo || '',
        color: this.mascota?.color || '',
        peso: this.mascota?.peso ?? null,
        notas: this.mascota?.notas || '',
        duenio_id: this.mascota?.duenio_id || ''
      });
    }

    this.loadDueños();
  }

  loadDueños(): void {
    this.dueñosService.getAll().subscribe({
      next: (data) => {
        this.duenios.set(data);
      },
      error: (err) => console.error('Error al cargar dueños:', err)
    });
  }

  onSubmit(): void {
    if (this.mascotaForm.valid) {
      const formValue = this.mascotaForm.value;
      const petToSave = {
        id: formValue.id,
        nombre: formValue.nombre,
        especie: formValue.especie,
        raza: formValue.raza,
        fecha_nacimiento: formValue.fecha_nacimiento,
        sexo: formValue.sexo,
        color: formValue.color,
        peso: formValue.peso,
        notas: formValue.notas,
        duenio_id: formValue.duenio_id
      };

      this.formSubmit.emit({
        data: petToSave,
        isEdit: this.isEditMode()
      });
    }
  }

  closeModal(): void {
    this.mascotaForm.reset();
    this.modalClose.emit();
  }
}
