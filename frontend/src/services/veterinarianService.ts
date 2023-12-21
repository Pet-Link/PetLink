import { environment } from '../environment';
import medicalRecordModel from '../models/medicalRecordMode';

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

   

    static createMedicalRecord(medicalRecord: medicalRecordModel) {
        return fetch(`${VeterinarianService.baseUrl}/medicalrecord/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicalRecord),
        });
    }

    static getMedicalRecordForSpecificVet(vet_id: string) {
        return fetch(`${VeterinarianService.baseUrl}/medicalrecord/all/veterinarian/${vet_id}`, {
            method: 'GET'
        });
    }

    static deleteMedicalRecord(id: string) {
        return fetch(`${VeterinarianService.baseUrl}/medicalrecord/delete/${id}`, {
            method: 'DELETE'
        });
    }
}