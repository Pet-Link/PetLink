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

    static async getAllMeetGreetAdopter(adopter_ID: number) {
        return fetch(`${meetGreetService.baseUrl}/adopter/${adopter_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
}