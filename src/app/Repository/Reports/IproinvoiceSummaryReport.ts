import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IproinvoiceSummaryReport {
    ExporttoExcel(
        companycode: any,
        startDate: string,
        endDate: string
    ): Observable<APIResponse>;

}