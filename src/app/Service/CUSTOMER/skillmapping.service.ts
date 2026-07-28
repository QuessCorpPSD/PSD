import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';
import { ISkilltypeMapping } from '../../Repository/customer/Iskillmappingrepository';

@Injectable({
  providedIn: 'root'
})
export class SkillmappingService implements ISkilltypeMapping {
  env = environment
  constructor(private http: HttpClient) {
  }

  search(companyId: any, siteId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SkillMapping/Search/?companyId=' + companyId + '&siteId=' + siteId)
  }
  createUpdateSkillMapping(request: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'SkillMapping/CreateUpdateSkillMapping',
      request
    );
  }
  delete(companyid: any, siteid: any,userid:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SkillMapping/DeleteSkillMapping/' + companyid + '/' + siteid + '/' + userid);
  }
  getponumber(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/PoSearchByCompanyId/'+ companyId)
  }
}
