import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IInvoiceRepository {

    Search(val): Observable<APIResponse>;
    InvoiceInitiate(val): Observable<APIResponse>;
    ExportToExcel(val): Observable<APIResponse>;
    InitialSearch(val): Observable<APIResponse>;
    InitialSearchAllot(val): Observable<APIResponse>;
    InitiationSearchExport(request: any): Observable<APIResponse>;
    UploadCancel(formData): Observable<string>;
    GetGSTInvoice(userId: number): Observable<APIResponse>;
    DownloadInvoice(invoiceId: number): Observable<HttpResponse<Blob>>;
    BulkDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>>;   
    getGSTInvoiceType(): Observable<APIResponse>;
    getCTCDeductionType(): Observable<APIResponse>;
    getBillingType(): Observable<APIResponse>;
    getNetDeductionType(): Observable<APIResponse>;
    addGstInvoice(payload: any): Observable<APIResponse>;
    GetAllInvoiceAllotDetails(payload: any) :Observable<APIResponse>;
    GetAllInvoiceCancelDetails(): Observable<APIResponse>;
    BulkApproveInvoice(val): Observable<APIResponse>;
    BillingDashboard(user_Id): Observable<APIResponse>;
    DraftInvoiceEmployeeByRequestId(reqNo: number, invoiceType: string): Observable<APIResponse>;
    //GetAllInvoiceDetails(companyId: number, payPeriodId: number,userId): Observable<APIResponse>;
    GetAllAttributeAddAndUpdate(val): Observable<APIResponse>;
    GetPayPeriod(payload: any): Observable<APIResponse>;
    GetAllAttribute(val): Observable<APIResponse>
    GetIRNColors(): Observable<APIResponse>
    GetAllInvoiceDetailsByCompanyId(companyId: number, payPeriodId: number): Observable<APIResponse> ;
    GetExportData(companyId: number, payPeriodId: number): Observable<APIResponse>;
    InitiateIRN(InitiateIRN: any): Observable<APIResponse>;
    GetEInvoiceError(invoiceId): Observable<APIResponse>
    GetEInvoiceErrorHover(invoiceId): Observable<APIResponse>;
    UploadAttributesGST(formData: FormData): Observable<APIResponse>;
    GetConsolidatedPayRegister(payload: any): Observable<APIResponse>
    GetConsolidateInvoiceSummary(payload: any): Observable<APIResponse>
    getRemarksByReqNo(val): Observable<APIResponse>;
    GetGstRates(payload: any) :Observable<APIResponse>;
   // //BulkIRNDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>>
    GetParticulars(payload: any): Observable<APIResponse>;
    GetInvoiceStatus(payload: any): Observable<APIResponse>;
    GetInvoiceDetailsById(payload: any): Observable<APIResponse>;
    RejectInvoice(formData: FormData): Observable<APIResponse>;
    GetUploadedFile(invoice_Id: number):Observable<APIResponse>;
    BulkRejectCancelRequest(payload: any):Observable<APIResponse>;
   ProvisionalInvoiceInitiate(requestPayload: any): Observable<APIResponse> ;
    //DownloadInvoiceIRN(invoiceId: number): Observable<HttpResponse<Blob>>
    
   
}