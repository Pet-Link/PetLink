import { environment } from '../environment';
import petModel from '../models/petModel';

export class PetService {
  private static baseUrl: string = environment.apiUrl + '/pet';

  static getPets() {
    return fetch(`${PetService.baseUrl}/all`);
  }

  static getPetById(pet_ID: number) {
    return fetch(`${PetService.baseUrl}/${pet_ID}`);
  }

  static addPet(pet: petModel) {
    console.log(JSON.stringify(pet));
    return fetch(`${PetService.baseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
  }

  static updatePet(pet: petModel) {
    return fetch(`${PetService.baseUrl}/${pet.pet_ID}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
  }

  static deletePet(pet_ID: number) {
    return fetch(`${PetService.baseUrl}/${pet_ID}/delete`, {
      method: 'DELETE',
    });
  }

  static getPetShelterDetails() {
    return fetch(`${PetService.baseUrl}/all-unadopted-shelter-names`);
  }
}