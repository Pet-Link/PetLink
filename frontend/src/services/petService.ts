import { environment } from '../environment';
import petModel from '../models/petModel';

export class PetService {
  private static baseUrl: string = environment.apiUrl + '/pet';

  static getPets() {
    return fetch(`${PetService.baseUrl}/all`);
  }

  static getPetsWithShelters() {
    return fetch(`${PetService.baseUrl}/all/with-shelters`);
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

  static getSpecies() {
    return fetch(`${PetService.baseUrl}/species`);
  }

  static getBreeds() {
    return fetch(`${PetService.baseUrl}/breeds`);
  }

  static filterPets(adopted: string, breed: string, species: string, age: string, vaccination_status: string, neutered_status: string, house_trained_status: string, sex: string) {
    var temp = {
      breed: breed,
      species: species,
      age: age,
      vaccination_status: vaccination_status,
      neutered_status: neutered_status,
      house_trained_status: house_trained_status,
      sex: sex
    }
    return fetch(`${PetService.baseUrl}/filter/${adopted}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(temp),
    });
  }

  static filterPetsOfShelter(shelter_ID:string, adopted: string, breed: string, species: string, age: string, vaccination_status: string, neutered_status: string, house_trained_status: string, sex: string) {
    var temp = {
      breed: breed,
      species: species,
      age: age,
      vaccination_status: vaccination_status,
      neutered_status: neutered_status,
      house_trained_status: house_trained_status,
      sex: sex
    }
    return fetch(`${PetService.baseUrl}/filter-by-shelter/${shelter_ID}/${adopted}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(temp),
    });
  }

  static getPetsByShelter(shelter_ID: string) {
    return fetch(`${PetService.baseUrl}/shelter/${shelter_ID}`);
  }
}