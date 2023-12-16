import { environment } from 'src/environment';

export class AuthenticationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.apiUrl;
  }

  async login( body: object): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const response = await this.postData('login', body);
      return response;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }

  }
}

export default ApiService;
