import { environment } from '../environment';
import applyAdoptModel from '../models/applyAdopt';

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

    static applyForAdoption(age: string, sex:string, apply_adopt: applyAdoptModel) {

        const user_ID = localStorage.getItem("user_ID");
        // First fetch call and wait for it to complete
        return fetch(`${AdopterService.baseUrl}/adopter/${user_ID}/update_age_sex`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({age, sex})
        })
        .then(response => {
            if (response.ok) {
                // After the first fetch succeeds, then start the second fetch
                return fetch(`${AdopterService.baseUrl}/applyadopt/create`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(apply_adopt),
                });
            } else {
                throw new Error('Adopter update fetch failed when creating an adoption application');
            }
        });
    }
}