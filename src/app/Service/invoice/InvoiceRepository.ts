import { Injectable } from "@angular/core";
import { IInvoiceRepository } from "../../Repository/invoice/IInvoiceRepository";
import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class InvoiceRepository implements IInvoiceRepository {
    environment = environment;
    constructor(private http: HttpClient) {

    }

    GetAllInvoiceDetailsByCompanyId(companyId: number, payPeriodId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}EInvoice/GetAllInvoiceDetails/${companyId}/${payPeriodId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetAllAttributeAddAndUpdate(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}Attributes/AttributeAddUpdate`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    GetAllAttribute(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}GSTInvoice/GetAllAttribute`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    GetExportData(companyId: number, payPeriodId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}EInvoice/EInvoiceExport/${companyId}/${payPeriodId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetEInvoiceError(invoiceId): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'GSTInvoice/EInvoiceError/' + invoiceId)
    }
    UploadAttributesGST(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'GSTInvoice/UploadAttributes',
            formData
        );
    }
    GetConsolidatedPayRegister(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/PayRegisterDownload`;
        console.log(url);
        return this.http.post<APIResponse>(url, payload);
    }

    GetConsolidateInvoiceSummary(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetConsolidateInvoiceSummary`;
        console.log(url);
        return this.http.post<APIResponse>(url, payload);
    }

    GetEInvoiceErrorHover(invoiceId): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'GSTInvoice/EInvoiceErrorHover/' + invoiceId)
    }

    InitiateIRN(InitiateIRN: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/InitiateIRN`;
        return this.http.post<APIResponse>(url, InitiateIRN);
    }
    GetIRNColors(): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetAllInvoiceTypeColors`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    BillableUpload(request: any): Observable<APIResponse> {
        var billableDaysModelRequest = JSON.stringify(request);
        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        console.log(billableDaysModelRequest);
        return this.http.post<APIResponse>(this.environment.apiUrl + "BillableDays/BillableDaysUpload", billableDaysModelRequest, { headers: config })
    }

    BillableDaysSearchExport(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + "BillableDays/ExportToExcel", inputval, { headers: config })
    }

    BillableSearch(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);

        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + "BillableDays/SearchDetails", inputval, { headers: config })
    }

    BillableTemplateDownload(importtype): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'BillableDays/DownloadTemplate/' + importtype);
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


    GetAllInvoiceDetails(companyId: number, payPeriodId: number, userId: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Invoice/GetAllInvoiceDetails/${companyId}/${payPeriodId}/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    // UploadReject(formData): Observable<APIResponse> {
    //     const url = `${this.environment.apiUrl}Onboarding/PostUploadReject`;
    //     //console.log(url)
    //     return this.http.post<APIResponse>(url, formData);
    // }

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


    POSearch(companyId: number, payPeriodId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}POInvoiceInitiate/Search/${companyId}/${payPeriodId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    POInvoiceInitiate(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.environment.apiUrl + 'POInvoiceInitiate/POInvoiceInitiate', payload);
    }

    ExportPOInvoice(companyId: number, payPeriodId: number): Observable<any> {
        return this.http.get<APIResponse>(
            environment.apiUrl + `POInvoiceInitiate/POInvoiceInitiateExport/${companyId}/${payPeriodId}`);
    }

    RequestPOInvoice(companyId: number, payPeriodId: number): Observable<any> {
        return this.http.get<APIResponse>(
            environment.apiUrl + `POInvoiceInitiate/POInvoiceRequest/${companyId}/${payPeriodId}`);
    }

    UploadBillable(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}BillableDays/BillableDaysUpload`;

        return this.http.post<APIResponse>(url, formData);
    }

    POInvoiceUpload(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}POInvoiceInitiate/Upload`;

        return this.http.post<APIResponse>(url, formData);
    }
    getRemarksByReqNo(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}InvoiceInitiation/getRemarksByReqNo`;

        return this.http.post<APIResponse>(url, formData);
    }



}