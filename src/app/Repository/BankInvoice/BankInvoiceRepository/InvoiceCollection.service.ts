import { Observable } from "rxjs";
import { APIResponse } from "../../../Models/apiresponse";

export interface IInvoiceCollectionService {
    search(companyId: number, payPeriodId: number, invoiceCollectionId: number, mode: string): Observable<APIResponse>;
    exportToExcel(companyId: number, payPeriodId: number): Observable<APIResponse>;
    importInvoiceCollection(payload: any): Observable<APIResponse>;
    GetClientAdvancePaymentTemplate(flag: string, userId: number): Observable<APIResponse>;
}