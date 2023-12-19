import { environment } from '../environment';
import appointmentModel from '../models/appointment';

export class AppointmentService {
    private static baseUrl: string = environment.apiUrl;

    static getAppointment(appointment_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/appointment/${appointment_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getAppointments() {
        return fetch(`${AppointmentService.baseUrl}/appointment`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static addAppointment(appointment: any) {
        return fetch(`${AppointmentService.baseUrl}/appointment`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appointment),
        });
    }

    static updateAppointment(appointment: appointmentModel) {
        return fetch(`${AppointmentService.baseUrl}/appointment/update`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appointment),
        });
    }

    static deleteAppointment(appointment_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/appointment/${appointment_ID}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
    }
}