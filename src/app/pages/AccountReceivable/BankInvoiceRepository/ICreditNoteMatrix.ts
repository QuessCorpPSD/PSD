import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ICreditNoteMatrix {
    Search(): Observable<APIResponse>;
    ExportToExcel(): Observable<APIResponse>;
    GetCommonDropDownList(
        Flag: any,
        UserId: any
    ): Observable<any>;

}