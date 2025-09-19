import { Component, computed, inject, signal } from '@angular/core';
import { DueniosService } from '../duenios.service';
import { catchError, finalize, of, pipe, throwError } from 'rxjs';
import { CommonModule, NgPlural } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateDuenioRequest, DueniosPagedResponse, DueniosResponse, UpdateDuenioRequest } from '../duenios.models';
import { DuenioModalFormComponent } from "../components/duenio-modal-form.component";
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../../core/errors/error-handler.service';
import { PagedResultDto } from '../../../shared/common.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-duenios',
  imports: [CommonModule, FormsModule, DuenioModalFormComponent],
  templateUrl: './duenios.component.html',
  styles: ``
})
export default class DueniosComponent {
  private dueniosService = inject(DueniosService);
  private toastService = inject(ToastrService);
  private errorHandlerService = inject(ErrorHandlerService);

  duenios = signal<PagedResultDto<DueniosPagedResponse> | null>(null);
  selectedDuenio = signal<DueniosPagedResponse | null>(null);
  isLoading = signal(false);

  hasDueniosItems = computed(() => {
    const dueniosData = this.duenios();
    return dueniosData?.items?.length ?? 0 > 0;
  });

  currentPage = signal(1);
  pageSize = signal(10);

  constructor() {}

  ngOnInit(): void {
    this.loadDuenios();
  }

  loadDuenios(): void {
    this.isLoading.set(true);

    this.dueniosService.getAllPaged(this.currentPage(), this.pageSize())
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.duenios.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar dueños', err);
          this.isLoading.set(false);
        }
      });
  }

  onPageChange(page: number | undefined): void {
    if (page && page > 0 && page <= (this.duenios()?.totalPages ?? 0)) {
      this.currentPage.set(page);
      this.loadDuenios();
    }
  }

  onFormSubmit(formData: { data: any; isEdit: boolean }): void {
    this.isLoading.set(true);

    const { id, ...duenioData } = formData.data;

    const operation$ = formData.isEdit
      ? this.dueniosService.update(id, duenioData as UpdateDuenioRequest)
      : this.dueniosService.create(duenioData as CreateDuenioRequest);


    operation$
      .pipe(
        // El catchError ahora solo se asegura de que el error sea manejable
        catchError((err) => throwError(() => err)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastService.success(`Dueño: ${response}`, 'Operación exitosa!');
          this.loadDuenios();
          this.selectedDuenio.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.errorHandlerService.handleError(err);
        },
      });
  }

  onNewClick(): void {
    this.selectedDuenio.set(null);
  }

  onEditClick(duenio: DueniosPagedResponse): void {
    this.selectedDuenio.set(duenio);
  }

  onModalClose(): void {
    this.selectedDuenio.set(null);
  }

  getPages(): number[] {
    const totalPages = this.duenios()?.totalPages;
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
