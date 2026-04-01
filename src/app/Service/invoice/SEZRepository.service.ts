import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../Models/apiresponse';
import { Observable } from 'rxjs';
import { ISEZRepositoryService } from '../../Repository/invoice/iSEZRepository.service';
@Injectable({
    providedIn: 'root'
})
export class SEZRepositoryService implements ISEZRepositoryService {

    environment = environment;
    constructor(private http: HttpClient) {
    }
    Search(companyId: number, payperiodId: number, InvoiceNumber: string, year: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}SEZRepositoryApproval/Search/${companyId}/${payperiodId}/${InvoiceNumber}/${year}`;
        //console.log(url);
        return this.http.get<APIResponse>(url)
    }

    // UploadSEZDocument(formData: FormData): Observable<APIResponse> {
    //     const url = `${this.environment.apiUrl}SEZRepository/UploadSEZDocument`;
    //     //console.log(url);
    //     return this.http.post<APIResponse>(url, formData)
    // }

    GetUploadedFile(invoice_Id: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}SEZRepositoryApproval/GetUploadedFile/${invoice_Id}`;
        console.log(invoice_Id);
        return this.http.get<APIResponse>(url);
    }

    BulkApproveSEZ(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}SEZRepositoryApproval/BulkApproveSEZ`;
        return this.http.post<APIResponse>(url, payload);
    }
}