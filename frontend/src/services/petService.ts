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
    // var species = pet.species;
    // var breed = pet.breed;
    // var age = pet.age;
    // var neutered_status = pet.neutered_status;
    // var shelter_ID = pet.shelter_ID;
    // var sex = pet.sex;
    // var description = pet.description;
    // var name = pet.name;
    // var vaccination_status = pet.vaccination_status;
    // var house_trained_status = pet.house_trained_status;
    // var adoption_fee = pet.adoption_fee;
    console.log(JSON.stringify(pet));
    return fetch(`${PetService.baseUrl}/create`, {
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
    return fetch(`${PetService.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  static getShelterName(pet_ID: string) {
    return fetch(`${PetService.baseUrl}/pet_id/${pet_ID}/shelter`);
  }
}