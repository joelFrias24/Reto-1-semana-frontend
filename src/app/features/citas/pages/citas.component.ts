import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { CitasService } from '../citas.service';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { CitaModalFormComponent } from "../components/cita-modal-form.component";
import { CreateCitaRequest, obtenerPorRangoFechaResponse, UpdateCitaRequest } from '../citas.models';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../../core/errors/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-citas',
  imports: [FullCalendarModule, CitaModalFormComponent],
  templateUrl: './citas.component.html',
  styles: ``
})
export default class CitasComponent implements OnInit {
  @ViewChild('citaModalComponent') citaModalComponent!: CitaModalFormComponent;

  private citasService = inject(CitasService);
  private toastService = inject(ToastrService);
  private errorHandlerService = inject(ErrorHandlerService);

  events: any[] = [];
  citaSeleccionada = signal<obtenerPorRangoFechaResponse | null>(null);
  isLoading = signal(false);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin],
    themeSystem: 'bootstrap5',
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    contentHeight: 600,
    events: [],
    /* dateClick: this.onDateClick.bind(this), */
    eventClick: this.onEventClick.bind(this)
  };

  ngOnInit() {
    this.loadCitas();
  }

  loadCitas() {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));

    this.citasService.getCitasPorRangoDeFecha(monday)
      .subscribe((citas) => {
        this.events = citas.map((a) => ({
          id: a.id,
          title: `${a.nombre} - ${a.servicio}`,
          start: a.fecha_hora_inicio,
          end: a.fecha_hora_fin,
          backgroundColor: a.estatus === 'Cancelada' ? '#dc3545' : '#0d6efd',
          borderColor: '#000',
          extendedProps: a
        }));

        this.calendarOptions = { ...this.calendarOptions, events: this.events };
      });
  }

  onFormSubmit(formData: { data: any; isEdit: boolean }): void {
    this.isLoading.set(true);

    const { id, ...mascotaData } = formData.data;
    console.log('citas component: ' + id, mascotaData);
    const operation$ = formData.isEdit
      ? this.citasService.update(id, mascotaData as UpdateCitaRequest)
      : this.citasService.create(mascotaData as CreateCitaRequest);


    operation$
      .pipe(
        // El catchError ahora solo se asegura de que el error sea manejable
        catchError((err) => throwError(() => err)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastService.success(`Mascota: ${response}`, 'Operación exitosa!');
          this.loadCitas();
          this.citaSeleccionada.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.errorHandlerService.handleError(err);
        },
      });
  }

  onNewClick(): void {
    this.citaSeleccionada.set(null);
  }

  onEventClick(arg: any) {
    this.citaSeleccionada.set(arg.event.extendedProps as obtenerPorRangoFechaResponse);
  }

  onModalClose(): void {
    this.citaSeleccionada.set(null);
  }
}
