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

    const url = `${this.environment.apiUrl}Attributes/GetAllAttribute`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
  }
    GetIRNColors(): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}EInvoice/GetAllInvoiceTypeColors`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
    GetAllInvoiceDetailsByCompanyId(companyId: number, payPeriodId: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}EInvoice/GetAllInvoiceDetails/${companyId}/${payPeriodId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
    GetExportData(companyId: number, payPeriodId: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}EInvoice/EInvoiceExport/${companyId}/${payPeriodId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  DownloadInvoice(invoiceId: number): Observable<HttpResponse<Blob>> {
    const url = `${this.environment.apiUrl}EInvoice/Download/${invoiceId}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }
  BulkDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>> {
    const url = `${this.environment.apiUrl}EInvoice/BulkDownload`;
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

     InitiateIRN(InitiateIRN: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}EInvoice/InitiateIRN`;
    console.log(url);
    console.table(InitiateIRN);
    return this.http.post<APIResponse>(url, InitiateIRN);
  }
    GetEInvoiceError(invoiceId): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'EInvoice/EInvoiceError/' + invoiceId)
  }

  GetEInvoiceErrorHover(invoiceId): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'EInvoice/EInvoiceErrorHover/' + invoiceId)
  }
    UploadAttributesGST(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'EInvoice/UploadAttributes',
      formData
    );
  }
    GetConsolidatedPayRegister(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}EInvoice/PayRegisterDownload`;
    console.log(url);
    return this.http.post<APIResponse>(url, payload);
  }

  GetConsolidateInvoiceSummary(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}EInvoice/GetConsolidateInvoiceSummary`;
    console.log(url);
    return this.http.post<APIResponse>(url, payload);
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
    GetGstRates(payload: any): Observable<APIResponse> {
         const url = `${this.environment.apiUrl}GSTInvoice/GetGstRates`;
console.log(url);
        return this.http.post<APIResponse>(url, payload);
    }
     BillingDashboard(user_Id): Observable<APIResponse> {
        
        return this.http.get<APIResponse>(
            this.environment.apiUrl + 'Invoice/BillingDashboardByUserId/'+user_Id
        );
    }
     DraftInvoiceEmployeeByRequestId(reqNo): Observable<APIResponse>{
       return this.http.get<APIResponse>(
            this.environment.apiUrl + 'Invoice/DraftInvoiceEmployeeByRequestId/'+reqNo
        );
    }


 
}