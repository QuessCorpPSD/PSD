import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpResponse } from '@angular/common/http';

export interface ICreditNoteUpdate {
    CreditnoteSearch(companyId: any, fromDate: any, toDate: any): Observable<APIResponse>;
    CreditNoteExport(payload: any): Observable<APIResponse>;
    BulkDownload(payload: any): Observable<Blob>;
    ImportCreditNoteCancel(payload: any): Observable<APIResponse>
    BulkDownloadCreditNote(BulkInvoices: any): Observable<HttpResponse<Blob>>


}