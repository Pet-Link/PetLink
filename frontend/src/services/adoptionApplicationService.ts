import { environment } from '../environment';
import applyAdoptModel from '../models/applyAdoptModel';

export class adoptionApplicationService{

    static applyForAdoption(age: string, sex:string, apply_adopt: applyAdoptModel) {

        const user_ID = localStorage.getItem("user_ID");
        // First fetch call and wait for it to complete
        return fetch(`${environment.apiUrl}/adopter/${user_ID}/update_age_sex`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({age, sex})
        })
        .then(response => {
            if (response.ok) {
                // After the first fetch succeeds, then start the second fetch
                return fetch(`${environment.apiUrl}/applyadopt/create`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(apply_adopt),
                });
            } else {
                throw new Error('Adopter update fetch failed when creating an adoption application');
            }
        });
    }

    static getApplication(adopter_ID: number, pet_ID: number) {
        return fetch(`${environment.apiUrl}/applyadopt/${adopter_ID}/${pet_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getAdminApplications() {
        const user_ID = localStorage.getItem("user_ID");
        return fetch(`${environment.apiUrl}/applyadopt/admin/${user_ID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static evaluateApplication(adopter_ID: number, pet_ID: number, approval_status: number, admin_remarks: string) {
        return fetch(`${environment.apiUrl}/applyadopt/evaluate/${adopter_ID}/${pet_ID}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({approval_status, admin_remarks}),
        });
    }

    static deleteApplication(adopter_ID: number, pet_ID: number) {
        return fetch(`${environment.apiUrl}/applyadopt/delete/${adopter_ID}/${pet_ID}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
    }

}
