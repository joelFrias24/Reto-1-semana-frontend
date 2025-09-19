import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private toastService = inject(ToastrService)

  constructor() { }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Un error del lado del cliente o de la red
      this.toastService.error('Ocurrió un error en el cliente o la red.', 'Error de Conexión');
    } else {
      // El backend retornó un código de respuesta fallido.
      const apiErrors = error.error;
      if (apiErrors && apiErrors.errors) {
        Object.values(apiErrors.errors).forEach((errorArray: any) => {
          errorArray.forEach((message: string) => {
            this.toastService.error(message, 'Error de Validación');
          });
        });
      } else if (apiErrors && apiErrors.title) {
        this.toastService.error(apiErrors.title, 'Error');
      } else {
        this.toastService.error('Ocurrió un error inesperado en el servidor.', 'Error de Servidor');
      }
    }
    // Devolvemos un observable con un error para que la cadena de llamadas se detenga
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
