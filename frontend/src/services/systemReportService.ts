import { environment } from '../environment';
import { AdoptionFeesSummaryModel, TopAdoptedBreedModel, TopAdopterModel, TopVeterinarianModel } from '../models/systemReportModels';

export class SystemReportService {
    private static baseUrl: string = environment.apiUrl + '/systemreport';

    static async getTopVeterinarians(): Promise<TopVeterinarianModel[]> {
    const response = await fetch(`${SystemReportService.baseUrl}/top-veterinarians`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
    return response.json();
    }
    
    static async getAdoptionFeesSummary(): Promise<AdoptionFeesSummaryModel> {
        const response = await fetch(`${SystemReportService.baseUrl}/adoption-fees-summary`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        return response.json();
    }

    static async getTopAdopters(): Promise<TopAdopterModel[]> {
        const response = await fetch(`${SystemReportService.baseUrl}/top-adopters`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        return response.json();
    }

    static async getTopAdoptedBreeds(): Promise<TopAdoptedBreedModel[]> {
        const response = await fetch(`${SystemReportService.baseUrl}/top-adopted-breeds`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        return response.json();
    }
}