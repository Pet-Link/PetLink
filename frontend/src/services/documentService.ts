import { environment } from '../environment';

export class AuthenticationService {
    private static baseUrl: string = environment.apiUrl;

    // upload the document
    static uploadDocument(title: string, content: string, user_ID: string) {
        return fetch(`${AuthenticationService.baseUrl}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, user_ID }),
        });
    }
}