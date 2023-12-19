import { environment } from '../environment';
import meetGreetModel from '../models/meetGreet';

export class meetGreetService{
    static createMeetGreet(meetGreet: meetGreetModel) {
        return fetch(`${environment.apiUrl}/meetandgreet/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meetGreet)
        });
    }
}