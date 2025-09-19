import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MascotasService } from '../mascotas.service';
import { CreateMascotaRequest, mascota, UpdateMascotaRequest } from '../mascotas.models';
import { PagedResultDto } from '../../../shared/common.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaModalFormComponent } from "../components/mascota-modal-form.component";
import { catchError, finalize, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../core/errors/error-handler.service';

@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, FormsModule, MascotaModalFormComponent],
  templateUrl: './mascotas.component.html',
  styles: ``
})
export default class MascotasComponent implements OnInit {
  private mascotasService = inject(MascotasService);
  private toastService = inject(ToastrService);
  private errorHandlerService = inject(ErrorHandlerService);

  mascotas = signal<PagedResultDto<mascota> | null>(null);
  selectedPet = signal<mascota | null>(null);
  isLoading = signal(false);

  hasMascotasItems = computed(() => {
    const mascotasData = this.mascotas();
    return mascotasData?.items?.length ?? 0 > 0;
  });

  currentPage = signal(1);
  pageSize = signal(10);
  searchQuery = signal('');

  ngOnInit(): void {
    this.loadMascotas();
  }

  loadMascotas(): void {
    this.isLoading.set(true);
    this.mascotasService
      .getMascotasPaged(this.currentPage(), this.pageSize(), this.searchQuery())
      .subscribe({
        next: (data) => {
          this.mascotas.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar mascotas', err);
          this.isLoading.set(false);
        },
      });
  }

  onPageChange(page: number | undefined): void {
    if (page && page > 0 && page <= (this.mascotas()?.totalPages ?? 0)) {
      this.currentPage.set(page);
      this.loadMascotas();
    }
  }

  onFormSubmit(formData: { data: any; isEdit: boolean }): void {
    this.isLoading.set(true);

    const { id, ...mascotaData } = formData.data;
    console.log(id, mascotaData);
    const operation$ = formData.isEdit
      ? this.mascotasService.update(id, mascotaData as UpdateMascotaRequest)
      : this.mascotasService.create(mascotaData as CreateMascotaRequest);


    operation$
      .pipe(
        // El catchError ahora solo se asegura de que el error sea manejable
        catchError((err) => throwError(() => err)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastService.success(`Mascota: ${response}`, 'Operación exitosa!');
          this.loadMascotas();
          this.selectedPet.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.errorHandlerService.handleError(err);
        },
      });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadMascotas();
  }

  onNewClick(): void {
    this.selectedPet.set(null);
  }

  onEditClick(mascota: mascota): void {
    this.selectedPet.set(mascota);
  }

  onModalClose(): void {
    this.selectedPet.set(null);
  }

  getPages(): number[] {
    const totalPages = this.mascotas()?.totalPages;
    if (!totalPages) {
      return [];
    }

    const currentPage = this.currentPage();
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
