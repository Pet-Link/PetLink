import { environment } from '../environment';

export class VeterinarianService {
    private static baseUrl: string = environment.apiUrl;
    
    static getVeterinarians() {
        return fetch(`${VeterinarianService.baseUrl}/all`);
    }
    
    static getVeterinarianById(id: string) {
        return fetch(`${VeterinarianService.baseUrl}/veterinarian_id/${id}`);
    }
    
    static addVeterinarian(veterinarian: any) {
        console.log(JSON.stringify(veterinarian));
        return fetch(`${VeterinarianService.baseUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veterinarian),
        });
    }
    
    static updateVeterinarian(veterinarian: any) {
        return fetch(`${VeterinarianService.baseUrl}/veterinarian/${veterinarian.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veterinarian),
        });
    }
    
    static deleteVeterinarian(id: string) {
        return fetch(`${VeterinarianService.baseUrl}/veterinarian/${id}`, {
        method: 'DELETE',
        });
    }

    static getAllAppointmentsOfVeterinarian(vet_id: string) {
        return fetch(`${VeterinarianService.baseUrl}/appointment/all/${vet_id}`, {
            method: 'GET'
        });
    }

    static approveAppointment(veterinarian_ID: string, adopter_ID: string) {
        return fetch(`${VeterinarianService.baseUrl}/appointment/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({adopter_ID, veterinarian_ID})
        });
    }

    static rejectAppointment(veterinarian_ID: string, adopter_ID: string) {
        return fetch(`${VeterinarianService.baseUrl}/appointment/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({adopter_ID, veterinarian_ID})
        });
    }
}