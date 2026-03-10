import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { ICommonService } from "../Repository/ICommonService";
import { APIResponse } from "../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CommonService implements ICommonService {
  environment = environment
  constructor(private http: HttpClient) {

  }

  UserCreate(login): Observable<APIResponse> {
    var inputval = JSON.stringify(login);

    const config = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl + "Authendicate/UserCreate", inputval, { headers: config }).pipe(
      map(userInfo => {
        let data = userInfo.Data;
        return userInfo;
        //return userInfo.headers.get('authorization');
      }));
  }
  SwapCategory(login): Observable<APIResponse> {
    var inputval = JSON.stringify(login);

    const config = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/SwapCategory", inputval, { headers: config })

  }
  GetCompanyCodes(userId: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetAllCompanyCode/${userId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetPayperiodbyCompany(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetAllPayperiod/${companyId}`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetInvoiceType(): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceInitiation/GetTaxTypes`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetCurrentPayperiod(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetCurrentPayperiod/${companyId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }


  GetCityByCompanyCode(companyId: any, Group_Id: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetCityByCompanyCode/${companyId}/${Group_Id}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetProcessCategory(): Observable<APIResponse> {

    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const config = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/SwapCategory", { headers: config })

  }

  //   GetCompanyCodes(userId: number): Observable<APIResponse> {
  //       const url = `${this.environment.apiUrl}Common/GetAllCompanyCode/${userId}`;
  //       //console.log(url);
  //       return this.http.get<APIResponse>(url);
  //   }
  //   GetPayperiodbyCompany(companyId: any): Observable<APIResponse> {
  //       const url = `${this.environment.apiUrl}Common/GetAllPayperiod/${companyId}`;
  //       console.log(url);
  //       return this.http.get<APIResponse>(url);
  //   }
  //   GetInvoiceType(): Observable<APIResponse> {
  //       const url = `${this.environment.apiUrl}InvoiceInitiation/GetTaxTypes`;
  //       console.log(url);
  //       return this.http.get<APIResponse>(url);
  //   }
  //   GetCurrentPayperiod(companyId: any): Observable<APIResponse> {
  //       const url = `${this.environment.apiUrl}Common/GetCurrentPayperiod/${companyId}`;
  //       //console.log(url);
  //       return this.http.get<APIResponse>(url);
  //   }
  //   GetProcessCategory(): Observable<APIResponse> {
  //       const headers = new HttpHeaders({
  //           'Cache-Control': 'no-cache, no-store, must-revalidate',
  //           'Pragma': 'no-cache',
  //           'Expires': '0'
  //       }).set('Content-Type', 'application/json')
  //           .set('Accept', 'application/json');

  //   const config = { headers };
  //   return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllProcessCategory", config);
  // }

  GetInputType(): Observable<APIResponse> {
    //console.log(this.environment.apiUrl + "Common/GetAllInputType");
    return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllInputType")
  }
  GetReporting(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetReporting", config)
  }
  GetTeamLeader(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllTeamLead", config)
  }
  GetMangers(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllManager", config)
  }
  GetManagerByUserId(user_Id): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetManagerByUserId/" + user_Id, config)
  }

  // GetFun_Head(): Observable<APIResponse> {
  //   const headers = new HttpHeaders({
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     'Pragma': 'no-cache',
  //     'Expires': '0'
  //   }).set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json');
  //       const config = { headers };
  //       return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetManagerByUserId/" + user_Id, config)
  //   }


  GetFun_Head(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllFunctionalityHead", config)
  }
  GetRoles(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllActiveRole", config)
  }
  GetAccessType(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAccessType", config)
  }
  GetFinancialYears(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetFinancialYear", config)
  }
  GetUserById(userId): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetUserById/" + userId, config)
  }
  GetUserByEmployeeId(employeeID): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/UserByEmployeeId/" + employeeID, config)
  }
  GetAllUser(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetAllUser", config)
  }
  AddBreakDetail(val): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };

    return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/AddBreakDetail", JSON.stringify(val), config)
  }
  GetBreakDetail(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetAllBreakDetail", config)
  }
  GetEmployeeBreakByDate(userId, date): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');


    const val = {
      "userId": userId,
      "date": date
    }
    const url = `${this.environment.apiUrl}Admin/GetEmployeeBreak`;
    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    //return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeBreak/"+userId+"/"+date,config)
  }
  AddEmployeeBreak(val): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');



    const url = `${this.environment.apiUrl}Admin/EmployeeBreakAdd`;
    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    //return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeBreak/"+userId+"/"+date,config)
  }
  AddBulkEmployeeBreak(val): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');



    const url = `${this.environment.apiUrl}Admin/BulkEmployeeBreakAdd`;
    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    //return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeBreak/"+userId+"/"+date,config)
  }
  GetAllManager(roleId, userId): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetAllManager/" + roleId + '/' + userId, config);
  }
  GetAllTeamLeader(userId): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetTeamLeader/" + userId, config);
  }
  // GetAllUsers(): Observable<APIResponse> {
  //   const headers = new HttpHeaders({
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     'Pragma': 'no-cache',
  //     'Expires': '0'
  //   }).set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json');
  //   const config = { headers };
  //   return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetTeamLeader/" + userId, config);
  // }
  GetAllUsers(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetAllUser", config);
  }
  // GetAllEmployee(userId): Observable<APIResponse> {
  //   const headers = new HttpHeaders({
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     'Pragma': 'no-cache',
  //     'Expires': '0'
  //   }).set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json');
  //       const config = { headers };
  //       return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetAllUser", config);
  //   }
  GetAllEmployee(userId): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeByUserId/" + userId, config);
  }
  GetMapNamebyCompany(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetMapNamebyCompany/${companyId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetSitesByCompanyId(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetSitesByCompanyId/${companyId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetAllState(): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetAllState`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetPayCodes(): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetPayPeriod`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetPayperiodbyCompanySalaryRelease(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetSalaryReleasePayperiod/${companyId}/SalaryRelease`;
    return this.http.get<APIResponse>(url);
  }

  GetPayperiodbyCompanySalaryUpfront(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetSalaryReleasePayperiod/${companyId}/Upfront`;
    return this.http.get<APIResponse>(url);
  }

  GetPayperiodbyCompanyDeduction(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetSalaryReleasePayperiod/${companyId}/Deduction`;
    return this.http.get<APIResponse>(url);
  }

  GetPayperiodbyCompanyVanPayment(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetSalaryReleasePayperiod/${companyId}/VanPayment`;
    return this.http.get<APIResponse>(url);
  }
}