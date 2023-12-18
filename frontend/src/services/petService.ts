import { environment } from '../environment';

export class PetService {
  private static baseUrl: string = environment.apiUrl + '/pet';

  static getPets() {
    return fetch(`${PetService.baseUrl}/all`);
  }

  static getPetById(id: string) {
    return fetch(`${PetService.baseUrl}/pet_id/${id}`);
  }

  static addPet(pet: any) {
    return fetch(`${PetService.baseUrl}/pet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
  }

  static updatePet(pet: any) {
    return fetch(`${PetService.baseUrl}/pet/${pet.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
  }

  static deletePet(id: string) {
    return fetch(`${PetService.baseUrl}/pet/${id}`, {
      method: 'DELETE',
    });
  }
}