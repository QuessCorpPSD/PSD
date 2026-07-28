import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IARReportService } from '../../Repository/Reports/IARReoprtservice';

@Injectable({
    providedIn: 'root'
})
export class ARReportService implements IARReportService {
    env = environment;
    constructor(private http: HttpClient) { }


    ARReport(startDate: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            `${this.env.apiUrl}ARKnockOff/ARReportExport/${startDate}`
        );
    }

}