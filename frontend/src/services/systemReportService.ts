import { environment } from '../environment';
import { AdoptionFeesSummaryModel, TopAdoptedBreedModel, TopAdopterModel, TopVeterinarianModel } from '../models/systemReportModels';

export class SystemReportService {
    private static baseUrl: string = environment.apiUrl + '/systemreport';

    static async getTopVeterinarians() {
        return fetch(`${SystemReportService.baseUrl}/top-veterinarians`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
    
    static async getAdoptionFeesSummary() {
        return fetch(`${SystemReportService.baseUrl}/adoption-fees-summary`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static async getTopAdopters() {
        return fetch(`${SystemReportService.baseUrl}/top-adopters`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static async getTopAdoptedBreeds(){
        return fetch(`${SystemReportService.baseUrl}/top-adopted-breeds`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
}