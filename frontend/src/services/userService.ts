import { environment } from '../environment';

export class UserService {
    private static baseUrl: string = environment.apiUrl;

    static getUserById(user_ID: string) {
        return fetch(`${UserService.baseUrl}/user/${user_ID}`);
    }
}