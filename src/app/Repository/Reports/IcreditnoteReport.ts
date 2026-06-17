import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IcreditnoteReport {
    ExporttoExcel(
        companycode: any,
        startDate: string,
        endDate: string
    ): Observable<APIResponse>;

}