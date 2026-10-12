import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IServiceCharge {
    UploadOneTime(formData: FormData): Observable<APIResponse>;
    GetServiceCharge(): Observable<APIResponse>;
    GetServiceChargeNew(companyId: number): Observable<APIResponse>;
    GetServicechargetype(companyid: any): Observable<APIResponse>;
    SaveServiceCharge(request: any): Observable<APIResponse>;
    GetSearch(companyId: number): Observable<APIResponse>;
    employeecode(companyId: number, employeeId: number): Observable<APIResponse>;
    ServiceChargeDelete(payload: any): Observable<APIResponse>;

}