import { environment } from '../environment';
import appointmentModel from '../models/appointmentModel';

export class AppointmentService {
    private static baseUrl: string = environment.apiUrl + '/appointment';

    static addAppointment(appointment: appointmentModel) {
        return fetch(`${AppointmentService.baseUrl}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appointment),
        });
    }
    
    static getAppointment(appointment_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/${appointment_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getAppointments() {
        return fetch(`${AppointmentService.baseUrl}/all}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getAllAppointmentsOfAdopter(adopter_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/all/adopter/${adopter_ID}`, {
            method: 'GET'
        });
    }

    static getAllAppointmentsOfVeterinarian() {
        const vet_ID = localStorage.getItem("user_ID");
        return fetch(`${AppointmentService.baseUrl}/all/${vet_ID}`, {
            method: 'GET'
        });
    }

    static approveAppointment(veterinarian_ID: number, adopter_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({adopter_ID, veterinarian_ID})
        });
    }

    static rejectAppointment(veterinarian_ID: number, adopter_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({adopter_ID, veterinarian_ID})
        });
    }

    static updateAppointment(appointment: appointmentModel) {
        return fetch(`${AppointmentService.baseUrl}/update`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appointment),
        });
    }

    static deleteAppointment(veterinarian_ID: number, adopter_ID: number) {
        return fetch(`${AppointmentService.baseUrl}/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({adopter_ID, veterinarian_ID})
        });
    }

    
}