import { environment } from '../environment';

export class AdopterService {
    private static baseUrl: string = environment.apiUrl;

    static addBalance(top_up_amount: string) {
        const user_ID = localStorage.getItem("user_ID");
        return fetch(`${AdopterService.baseUrl}/adopter/${user_ID}/update_balance`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({top_up_amount}),
        });
    }

    static getAdopter(user_ID: number) {
        return fetch(`${AdopterService.baseUrl}/adopter/${user_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
}