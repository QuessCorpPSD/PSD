import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';
import { ILeaveMaster } from '../../Repository/Inputaggregator/ILeavemaster';

@Injectable({
  providedIn: 'root'
})
export class LeavetypemasterService implements ILeaveMaster {
  env = environment

  constructor(private http: HttpClient) { }

  getLeavetypes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InputAggregatorAttendance/leaveTypeMaster'
    );
  }
  LeavemasterSave(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'InputAggregatorAttendance/Createleavetype',
        payload
      );
  }

  getquessmaster(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InputAggregatorAttendance/QuessLeaveMaster'
    );
  }

  LeavemastermappingSave(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'InputAggregatorAttendance/Createleavemapping',
        payload
      );
  }

  Searchleavetypemapping(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InputAggregatorAttendance/SearchLeaveTypeMapping/' + companyid
    );
  }
}
