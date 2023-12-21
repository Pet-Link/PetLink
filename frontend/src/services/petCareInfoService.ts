import { environment } from '../environment';
import petCareInfoModel from '../models/petCareInfoModel';

export class PetCareInfoService {
    private static baseUrl: string = `${environment.apiUrl}/petcareinfo`;

    static createPetCareInfo(content: string, title: string, administrator_ID: number) {
        return fetch(`${PetCareInfoService.baseUrl}/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content, title, administrator_ID }),
        });
    }

    static getPetCareInfo(info_ID: number){
        return fetch(`${PetCareInfoService.baseUrl}/${info_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static updatePetCareInfo(info_ID: number, content: string, title: string, administrator_ID: number) {
        return fetch(`${PetCareInfoService.baseUrl}/${info_ID}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content, title, administrator_ID }),
        });
    }

    static deletePetCareInfo(info_ID: number){
        return fetch(`${PetCareInfoService.baseUrl}/${info_ID}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getAllPetCareInfo() {
        return fetch(`${PetCareInfoService.baseUrl}/all`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
}