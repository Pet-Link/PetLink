import { environment } from '../environment';
import { AdoptionFeesSummaryModel, TopAdoptedBreedModel, TopAdopterModel, TopVeterinarianModel } from '../models/systemReportModels';

export class SystemReportService {
    private static baseUrl: string = environment.apiUrl + '/systemreport';

    static getTopVeterinarians() {
        return fetch(`${SystemReportService.baseUrl}/top-veterinarians`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
    
    static getAdoptionFeesSummary() {
        return fetch(`${SystemReportService.baseUrl}/adoption-fees-summary`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getTopAdopters() {
        return fetch(`${SystemReportService.baseUrl}/top-adopters`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }

    static getTopAdoptedBreeds(){
        return fetch(`${SystemReportService.baseUrl}/top-adopted-breeds`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
    }
}