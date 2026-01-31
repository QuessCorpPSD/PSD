import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IInvoiceRepository {

    Search(val): Observable<APIResponse>;
    InvoiceInitiate(val): Observable<APIResponse>;
    ExportToExcel(val): Observable<APIResponse>;
    InitialSearch(val): Observable<APIResponse>;
    InitiationSearchExport(val): Observable<APIResponse>;
    UploadCancel(formData): Observable<string>;
    GetGSTInvoice(userId: number): Observable<APIResponse>;
    DownloadInvoice(invoiceId: number): Observable<HttpResponse<Blob>>;
    BulkDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>>;
    getGSTInvoiceType(): Observable<APIResponse>;
    getCTCDeductionType(): Observable<APIResponse>;
    getBillingType(): Observable<APIResponse>;
    getNetDeductionType(): Observable<APIResponse>;
    addGstInvoice(payload: any): Observable<string>;
    GetAllInvoiceCancelDetails(val): Observable<APIResponse>;
    BulkApproveInvoice(val): Observable<APIResponse>;
    
}