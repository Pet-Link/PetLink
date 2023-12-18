import { environment } from '../environment';
import petModel from '../models/petModel';

export class PetService {
  private static baseUrl: string = environment.apiUrl + '/pet';

  static getPets() {
    return fetch(`${PetService.baseUrl}/all`);
  }

  static getPetById(id: string) {
    return fetch(`${PetService.baseUrl}/pet_id/${id}`);
  }

  static addPet(pet: petModel) {
    var species = pet.species;
    var breed = pet.breed;
    var age = pet.age;
    var neutered_status = pet.neutered_status;
    var shelter_ID = pet.shelter_ID;
    var sex = pet.sex;
    var description = pet.description;
    var name = pet.name;
    var vaccination_status = pet.vaccination_status;
    var house_trained_status = pet.house_trained_status;
    var adoption_fee = pet.adoption_fee;
    return fetch(`${PetService.baseUrl}/pet/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ species, breed, age, neutered_status, sex, description, name, vaccination_status, house_trained_status, adoption_fee, shelter_ID }),
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