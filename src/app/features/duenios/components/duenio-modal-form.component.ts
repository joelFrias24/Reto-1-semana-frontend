import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DueniosPagedResponse, DueniosResponse } from '../duenios.models';

@Component({
  selector: 'app-duenio-modal-form',
  imports: [ReactiveFormsModule],
  templateUrl: './duenio-modal-form.component.html',
  styles: ``,
})
export class DuenioModalFormComponent {
  private fb = inject(FormBuilder);

  @Input() duenio: DueniosPagedResponse | null = null;
  @Output() formSubmit = new EventEmitter<any>(); // Emite la data del formulario
  @Output() modalClose = new EventEmitter<void>(); // Emite cuando se cierra el modal

  duenioForm!: FormGroup;
  isEditMode = signal(false);

  ngOnChanges(): void {
    this.isEditMode.set(!!this.duenio);
    this.duenioForm = this.fb.group({
      id: [this.duenio?.id || null],
      nombre_completo: [this.duenio?.nombre_completo || '', Validators.required],
      num_identificacion: [
        this.duenio?.num_identificacion || '',
        Validators.required,
      ],
      direccion: [this.duenio?.direccion || '', Validators.required],
      telefono: [this.duenio?.telefono || '', Validators.required],
      correo: [
        this.duenio?.correo || '',
        [Validators.required, Validators.email],
      ],
    });
  }

  onSubmit(): void {
    if (this.duenioForm.valid) {
      // Solo emite la data del formulario y el modo de edición
      this.formSubmit.emit({
        data: this.duenioForm.value,
        isEdit: this.isEditMode()
      });
    }
  }

  closeModal(): void {
    this.duenioForm.reset();
    this.modalClose.emit();
  }
}
