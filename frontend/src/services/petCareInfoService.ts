import { environment } from '../environment';
import petCareInfoModel from '../models/petCareInfoModel';

export class PetCareInfoService {
    private static baseUrl: string = `${environment.apiUrl}/petcareinfo`;

    static async createPetCareInfo(content: string, title: string, administrator_ID: number) {
        return fetch(`${PetCareInfoService.baseUrl}/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content, title, administrator_ID }),
        });
    }

    static async getPetCareInfo(info_ID: number){
        return fetch(`${PetCareInfoService.baseUrl}/${info_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static async updatePetCareInfo(info_ID: number, content: string, title: string, administrator_ID: number) {
        return fetch(`${PetCareInfoService.baseUrl}/${info_ID}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content, title, administrator_ID }),
        });
    }

    static async deletePetCareInfo(info_ID: number){
        return fetch(`${PetCareInfoService.baseUrl}/${info_ID}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static async getAllPetCareInfo() {
        return fetch(`${PetCareInfoService.baseUrl}/all`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
}