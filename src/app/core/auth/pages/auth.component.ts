import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../auth.models';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../errors/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styles: ``
})
export default class AuthComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private toastService = inject(ToastrService);
  private errorHandlerService = inject(ErrorHandlerService);

  loading = signal(false);
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.loading.set(true);

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as LoginRequest)
        .pipe(
          catchError((err) => throwError(() => err)),
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: () => {
            this.toastService.success('Inicio de sesión exitoso');
            this.router.navigate(['/main']);
          },
          error: (err: HttpErrorResponse) => {
            this.errorHandlerService.handleError(err);
          }
        });

    } else {
      console.log('Formulario inválido');
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
