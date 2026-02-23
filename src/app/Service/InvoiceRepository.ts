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
    GetIRNColors(): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetAllInvoiceTypeColors`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetAllInvoiceDetailsByCompanyId(companyId: number, payPeriodId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetAllInvoiceDetails/${companyId}/${payPeriodId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetExportData(companyId: number, payPeriodId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/EInvoiceExport/${companyId}/${payPeriodId}`;
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

    DraftExporttoExcel(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/DraftExporttoExcel`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    InitiationSearchExport(IntiationExportRequest: any): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InitiationSearchExport`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(IntiationExportRequest), { headers });
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

    ProvisionalInvoiceInitiate(requestPayload: any): Observable<APIResponse> {
        //console.log('Sending PO save payload:', payload);
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'InvoiceInitiation/ProvisionalInvoiceInitiate', requestPayload);
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

    InitiateIRN(InitiateIRN: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/InitiateIRN`;
        console.log(url);
        console.table(InitiateIRN);
        return this.http.post<APIResponse>(url, InitiateIRN);
    }
    GetEInvoiceError(invoiceId): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'GSTInvoice/EInvoiceError/' + invoiceId)
    }

    GetEInvoiceErrorHover(invoiceId): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'GSTInvoice/EInvoiceErrorHover/' + invoiceId)
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

    // PayRegisterDownload(payload: any): Observable<APIResponse> {
    //     const url = `${this.environment.apiUrl}GSTInvoice/PayRegisterDownload`;
    //     console.log(url);
    //     return this.http.post<APIResponse>(url, payload);
    // }


    getGSTInvoiceType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTInvoiceType")
    }

    getCTCDeductionType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTCtcDeductionType")
    }

    getBillingType(): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTBillableType", {});
    }

    getNetDeductionType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "GSTInvoice/GetGSTNetDeductionType")
    }

    addGstInvoice(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/Create`;
        return this.http.post<APIResponse>(url, payload);
    }


    GetAllInvoiceCancelDetails(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}GSTInvoice/GetAllInvoiceCancelDetails`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, val, { headers });
    }

    BulkApproveInvoice(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}GSTInvoice/BulkApproveInvoice`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, val, { headers });
    }

    BulkRejectCancelRequest(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/BulkRejectCancelRequest`;
        return this.http.post<APIResponse>(url, payload);
    }

    GetAllInvoiceAllotDetails(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'InvoiceInitiation/GetAllInvoiceAllotDetails',
            payload
        );
    }
    getRemarksByReqNo(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}InvoiceInitiation/getRemarksByReqNo`;

        return this.http.post<APIResponse>(url, formData);
    }
    GetParticulars(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetParticulars`;

        return this.http.post<APIResponse>(url, payload);
    }

    GetGstRates(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetGstRates`;
        console.log(url);
        return this.http.post<APIResponse>(url, payload);
    }
    BillingDashboard(user_Id, flag): Observable<APIResponse> {

        return this.http.get<APIResponse>(
            this.environment.apiUrl + 'Invoice/BillingDashboardByUserId/' + user_Id + '/' + flag
        );
    }

    BillingDashboardExport(user_Id, flag): Observable<APIResponse> {

        return this.http.get<APIResponse>(
            this.environment.apiUrl + 'Invoice/BillingDashboardExport/' + user_Id + '/' + flag
        );
    }
    DraftInvoiceEmployeeByRequestId(reqNo: number, invoiceType: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.environment.apiUrl + `Invoice/DraftInvoiceEmployeeByRequestId/${reqNo}/${invoiceType}`
        );

    }
    GetPayPeriod(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetPayPeriod`;
        return this.http.post<APIResponse>(url, payload);
    }

    GetInvoiceStatus(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetInvoiceStatus`;
        return this.http.post<APIResponse>(url, payload);
    }

    GetInvoiceDetailsById(payload: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/Edit`;
        return this.http.post<APIResponse>(url, payload);
    }

    RejectInvoice(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/Reject`;

        return this.http.post<APIResponse>(url, formData);
    }
    GetUploadedFile(invoice_Id: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetUploadedFile/${invoice_Id}`;
        console.log(invoice_Id);
        return this.http.get<APIResponse>(url);
    }

}