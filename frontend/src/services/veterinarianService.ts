import { environment } from '../environment';

export class VeterinarianService {
    private static baseUrl: string = environment.apiUrl + '/veterinarian';
    
    static getVeterinarians() {
        return fetch(`${VeterinarianService.baseUrl}/all`);
    }
    
    static getVeterinarianById(id: string) {
        return fetch(`${VeterinarianService.baseUrl}/veterinarian_id/${id}`);
    }

    static getVeterinarianCities() {
        return fetch(`${VeterinarianService.baseUrl}/cities`);
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
        return fetch(`${VeterinarianService.baseUrl}/${veterinarian.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veterinarian),
        });
    }
    
    static deleteVeterinarian(id: string) {
        return fetch(`${VeterinarianService.baseUrl}/${id}`, {
        method: 'DELETE',
        });
    }


    static searchVeterinarian(name: string | null, city: string | null) {
        return fetch(`${VeterinarianService.baseUrl}/search`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, city}),
        });
    }
}