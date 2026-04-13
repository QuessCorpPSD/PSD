import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IVendorServiceCharge {
    getAllVendorServiceCharge(companyId: number): Observable<APIResponse>;
    saveVendorServiceCharge(request: any): Observable<APIResponse>;
    GetSearch(companyId: number): Observable<APIResponse>;
    importVendorServiceCharge(request: any): Observable<APIResponse>;
    GetAllBillingTypes(): Observable<APIResponse>;
    GetAllVendorServiceType(): Observable<APIResponse>;
}