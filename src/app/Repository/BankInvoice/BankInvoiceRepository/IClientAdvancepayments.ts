import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface IClientAdvancePaymets {
    Search(companyId: any, fromDate: any, toDate: any): Observable<APIResponse>;
    ClientAdvancePaymentExport(payload: any): Observable<APIResponse>;
    GetBankNameForOnAccount(): Observable<APIResponse>;
    GetOnAccountNumbers(description: string, action: string): Observable<APIResponse>;
    GetModeOfCollections(action: string): Observable<APIResponse>;
    SaveUpdateDeleteClientAdvancePayment(payload: any): Observable<APIResponse>;
    GetGroupNameByCompanyID(companyId: number): Observable<APIResponse>;
    GetAllCompanyCodes(userId: string): Observable<APIResponse>;
    ImportClientAdvancePayment(payload: any): Observable<APIResponse>;
    TransferClientAdvancePayment(payload: any): Observable<APIResponse>;
    GetClientAdvancePaymentTemplate(flag: string, userId: number): Observable<APIResponse>

}