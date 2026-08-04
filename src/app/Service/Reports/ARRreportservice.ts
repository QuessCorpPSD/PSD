import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IARReportService } from '../../Repository/Reports/IARReoprtservice';
import { environment } from '../../../environments/environment.development';

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