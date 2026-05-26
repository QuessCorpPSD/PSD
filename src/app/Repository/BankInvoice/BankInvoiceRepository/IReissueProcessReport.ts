import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface IReissueProcessReport {
    ReissueProcessSearch(fromdate: any, todate: any, status: any): Observable<APIResponse>;
    ReissueProcessReportExport(
        fromdate: any,
        todate: any,
        status: any
    ): Observable<APIResponse>
    ImportReissueProcess(payload: any): Observable<APIResponse>;
    GetReissueDeleteTemplate(flag: string, userId: number): Observable<APIResponse>;

}