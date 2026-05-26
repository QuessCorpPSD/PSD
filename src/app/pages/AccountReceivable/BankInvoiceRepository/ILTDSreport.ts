import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ILTDSReport {
    GetFinancialYear(): Observable<APIResponse>;
    GetBusinessUnits(reportTypeId: number): Observable<APIResponse>;


}