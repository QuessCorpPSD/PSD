import { Injectable } from "@angular/core";
import { IInvoiceRepository } from "../Repository/IInvoiceRepository";
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class InvoiceRepository implements IInvoiceRepository {
    environment = environment;
    constructor(private http: HttpClient) {

    }
    Search(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/Search`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    InitialSearch(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InitiationSearch`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    InitialSearchAllot(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InitiationSearchAllot`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    InitiationSearchExport(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InitiationSearchExport`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    InvoiceInitiate(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InvoiceInitiate`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    ExportToExcel(val): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}InvoiceInitiation/ExportToExcel`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    UploadCancel(formData): Observable<string> {
        const url = `${this.environment.apiUrl}GSTInvoice/PostCancelReject`;
        return this.http.post(url, formData, { responseType: 'text' });
    }

    GetGSTInvoice(userId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetGSTInvoice/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    DownloadInvoice(invoiceId: number): Observable<HttpResponse<Blob>> {
        const url = `${this.environment.apiUrl}GSTInvoice/Download/${invoiceId}`;
        return this.http.get(url, { responseType: 'blob', observe: 'response' });
    }
    BulkDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>> {
        const url = `${this.environment.apiUrl}GSTInvoice/BulkDownload`;
        console.log(url);
        console.table(BulkInvoices);
        return this.http.post(url, BulkInvoices, { responseType: 'blob', observe: 'response' });
    }

    getGSTInvoiceType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTInvoiceType")
    }

    getCTCDeductionType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTCtcDeductionType")
    }

    getBillingType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTBillableType")
    }

    getNetDeductionType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTNetDeductionType")
    }

    addGstInvoice(payload: any): Observable<string> {
        return this.http.post(this.environment.apiUrl + 'GSTInvoice/Create', payload, { responseType: 'text' })
    }

    GetAllInvoiceAllotDetails(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'InvoiceInitiation/GetAllInvoiceAllotDetails',
            payload
        );
    }


}