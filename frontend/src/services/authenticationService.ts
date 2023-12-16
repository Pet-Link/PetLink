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
}