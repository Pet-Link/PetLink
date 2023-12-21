import { environment } from '../environment';
import meetGreetModel from '../models/meetGreetModel';

export class meetGreetService{
    private static baseUrl: string = `${environment.apiUrl}/meetandgreet`;

    static createMeetGreet(meetGreet: meetGreetModel) {
        return fetch(`${meetGreetService.baseUrl}/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meetGreet)
        });
    }

    static getAllMeetGreetAdopter(adopter_ID: number) {
        return fetch(`${meetGreetService.baseUrl}/adopter/${adopter_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getAllMeetGreetShelter(shelter_ID: number) {
        return fetch(`${meetGreetService.baseUrl}/shelter/${shelter_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static deleteMeetGreet(adopter_ID: number, pet_ID: number) {
        return fetch(`${meetGreetService.baseUrl}/delete/${adopter_ID}/${pet_ID}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
    }
}