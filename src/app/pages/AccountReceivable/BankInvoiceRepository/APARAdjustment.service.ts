import { Observable } from "rxjs";
import { APIResponse } from "../../../Models/apiresponse";

export interface IAPARAdjustmentUpdateService {
    search(CompanyId: any, fromdate: any, todate: any): Observable<APIResponse>;
    exportToExcel(payload: any): Observable<APIResponse>;
    importAPARAdjustment(file: File, user: string): Observable<APIResponse>;
    importAPARAdjustmentCancel(file: File, user: string): Observable<APIResponse>
}