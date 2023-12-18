import { environment } from '../environment';

export class AuthenticationService {
  private static baseUrl: string = environment.apiUrl;

  static login(e_mail: string, password: string) {
    return fetch(`${AuthenticationService.baseUrl}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ e_mail, password }),
    });
  }

  static registerAdopter(name: string, e_mail: string, password: string, phone_number: string) {
    return fetch(`${AuthenticationService.baseUrl}/adopter/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, e_mail, phone_number, password }),
    });
  }

  static registerAdministrator(name: string, e_mail:string, password: string, phone_number: string, employee_ID: string) {
    return fetch(`${AuthenticationService.baseUrl}/administrator/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ e_mail, phone_number, password, name, employee_ID }),
    });
  }

  static registerVeterinarian(name: string, e_mail: string, password: string, phone_number: string, year_of_experience: string, speciality: string, street: string, district: string, city: string, country: string, apartment_no: string, zip: string) {
    return fetch(`${AuthenticationService.baseUrl}/veterinarian/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, e_mail, phone_number, password, year_of_experience, speciality, street, district, apartment_no, city, zip, country}),
    });
  }
  
  static registerShelter(name: string, e_mail: string, password: string, phone_number: string, street: string, district: string, city: string, country: string, apartment_no: string, zip: string, description: string) {
    return fetch(`${AuthenticationService.baseUrl}/shelter/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name, e_mail, phone_number, password, street, district, apartment_no, city, zip, country, description}),
    });
  }
}