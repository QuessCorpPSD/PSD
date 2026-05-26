import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface IforeCast {
    Getmonth(): Observable<APIResponse>;
    SearchForecast(companyId: any, payPeriodId: any, mode: string): Observable<APIResponse>;
    GetSBU(): Observable<APIResponse>;
    GetRegion(): Observable<APIResponse>;
    GetInvoiceNumber(companyId: number, payPeriodId: number): Observable<APIResponse>;
    SaveUpdateDeleteForecast(payload: any): Observable<APIResponse>;
    ImportForecast(payload: any): Observable<APIResponse>;
    ForecastExport(payload: any): Observable<APIResponse>;
    GetForecasttemplate(flag: string, userId: number): Observable<APIResponse>;
}