import { environment } from '../environment';
import medicalRecordModel from '../models/medicalRecordModel';

export class MedicalRecordService {
    private static baseUrl: string = `${environment.apiUrl}/medicalrecord`;

    static createMedicalRecord(medicalRecord: medicalRecordModel) {
        return fetch(`${MedicalRecordService.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicalRecord)
        });
    }

    static getMedicalRecord(record_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/${record_ID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static updateMedicalRecord(record_ID: number, medicalRecord: medicalRecordModel) {
        return fetch(`${MedicalRecordService.baseUrl}/update/${record_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicalRecord)
        });
    }

    static deleteMedicalRecord(record_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/delete/${record_ID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static deleteMedicalRecordByPet(pet_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/delete/pet/${pet_ID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static deleteMedicalRecordByVeterinarian(veterinarian_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/delete/veterinarian/${veterinarian_ID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static getAllMedicalRecords() {
        return fetch(`${MedicalRecordService.baseUrl}/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static getAllMedicalRecordsByPet(pet_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/all/pet/${pet_ID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static getAllMedicalRecordsByVeterinarian(veterinarian_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/all/veterinarian/${veterinarian_ID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static getAllMedicalRecordsByAdopter(adopter_ID: number) {
        return fetch(`${MedicalRecordService.baseUrl}/all/adopter/${adopter_ID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

