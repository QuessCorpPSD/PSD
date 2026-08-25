import { AfterViewInit, Component, ElementRef, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import {MatGridListModule} from '@angular/material/grid-list';

import { IDashBoardServices } from '../../Repository/IDashBoardService';
import { DashBoardServices } from '../../Service/DashBoardService';
import { error } from 'console';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { curveCatmullRom } from 'd3-shape';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartConfiguration } from 'chart.js';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
const dashboard = InjectionToken<IDashBoardServices>;
export  const Admin_TOKEN=new InjectionToken<ICommonService>('Admin_TOKEN');
@Component({
    selector: 'app-home',
    imports: [CommonModule, NgxChartsModule,MatTableModule,MatIconModule, RouterModule, NgChartsModule, MatGridListModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    providers: [
        {
            provide: dashboard,
            useClass: DashBoardServices,
        },
        {
                    provide: Admin_TOKEN,
                    useClass: CommonService,
                }
    ]
})
export class HomeComponent implements OnInit {
IsBreakdetail:boolean=false;
  date=new Date();
  userData:any;
  checkInStatus:boolean=false;
  checkOutStatus:boolean=false;
  checkInDateTime:any;
  checkoutDateTime:any;
  user:any;
  percent_inComplate_Assignment:any=0;
    @ViewChild("progressBar") progressBar!: ElementRef;
  constructor(
	@Inject(dashboard) private _dashboard: IDashBoardServices,
  @Inject(Admin_TOKEN) private _adminService: ICommonService,
	 private sessionStorageService: SessionStorageService,
	private _encry:EncryptionService,
  private dialog: MatDialog
){

  }
  displayedColumns: string[] = ['description',  'startTime','endTime'];
  dataSource:any=[];
ngOnInit(): void {
		const userdetail= this.sessionStorageService.getItem('UserProfile');
   this.user = JSON.parse(this._encry.decrypt(userdetail!));  
  this.GetDashboardByUserId(this.user.user_Id);
}
 getBreakDetailByEmployee(userId, date): void {
  this._adminService.GetEmployeeBreakByDate(userId, date).subscribe({
    next: res => {
      const breakData = res.Data;
      // use breakData here as needed
    
      this.dataSource=new MatTableDataSource<any>(res.Data);
      //this.autoSelectRows();
    },
    error: err => {
      console.error('Error fetching break details:', err);
    }
  });
}
CancelPopup(){
  this.IsBreakdetail=false;
}
convertToDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [datePart, timePart, meridiem] = value.trim().split(' ');

  const [day, month, year] = datePart.split('-').map(Number);
  let [hours, minutes, seconds] = timePart.split(':').map(Number);

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  );
}
TodayBreakDetailSlot(){
  const userdetail = this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!));
  this._dashboard.UserCheckIn(user.user_Id, "IN").subscribe({
    next: res => {
      console.log(res)
      if (res.Data.checkinDate != null) {
        this.checkInStatus = true;
        this.IsBreakdetail=false;
        this.checkInDateTime = res.Data.checkInTime;
        this.checkoutDateTime = res.Data.checkoutDateTime;
       // this.checkInDateTime = res.Data.checkInTime;
      }
      if (res.Data.checkinDate != null) {
        this.checkOutStatus=true;
        this.checkoutDateTime = res.Data.checkoutDateTime;
      }
    },
    error: err => { console.log(err) }
  })

}
formatDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [datePart, timePart, meridiem] = value.trim().split(' ');

  const [day, month, year] = datePart.split('-').map(Number);
  let [hours, minutes, seconds] = timePart.split(':').map(Number);

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
}
CheckIn(){
  
   const today_Date = new Date();   
   this.getBreakDetailByEmployee(this.user.user_Id, today_Date);
   this.IsBreakdetail=true;
//    this.dialog.open(HomeComponent, {
//   width: '650px',
//   maxWidth: '95vw',
//   panelClass: 'custom-dialog-panel',
//   autoFocus: false
// });
  // const userdetail = this.sessionStorageService.getItem('UserProfile');
  // var user = JSON.parse(this._encry.decrypt(userdetail!));
  // this._dashboard.UserCheckIn(user.user_Id, "IN").subscribe({
  //   next: res => {
  //     if (res.Data.checkinDate != null) {
  //       this.checkInStatus = true;
  //       this.checkInDateTime = res.Data.checkInTime;
  //     }
  //   },
  //   error: err => { console.log(err) }
  // })
}
CheckOut()
{
const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!));  
	this._dashboard.UserCheckIn(user.user_Id,"OUT").subscribe({
		next:res=>{if(res.Data.checkinDate!=null)
		{
			this.checkInStatus=true;
			
              const value = res.Data.checkInTime;
        const [datePart, timePart, meridiem] = value.split(' ');

const [day, month, year] = datePart.split('-').map(Number);

let [hours, minutes, seconds] = timePart.split(':').map(Number);

if (meridiem === 'PM' && hours !== 12) {
  hours += 12;
}

if (meridiem === 'AM' && hours === 12) {
  hours = 0;
}

this.checkInDateTime = new Date(
  year,
  month - 1,
  day,
  hours,
  minutes,
  seconds
);
  
		}
		},
		error:err=>{console.log(err)}
	})
}
public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        label: 'Sales',
        fill: 'origin', // Enable area fill
        tension: 0.4,   // Smooth curve
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };
GetDashboardByUserId(userId){

this._dashboard.GetUserDashBoard(userId).subscribe({
next: res => {
	this.userData=res.Data;
  
	this.checkInStatus=this.userData.checkInStatus;
	this.checkInDateTime=res.Data.checkInDateTime;
	this.percent_inComplate_Assignment=res.Data.inComplate_Assignment;
  (!this.checkInStatus)
  {
    this.IsBreakdetail=true;
    const today_Date = new Date();   
    this.getBreakDetailByEmployee(userId,today_Date)
  }
      // this.progressBar.nativeElement.style.width = this.percent_inComplate_Assignment+"%";
},
error:error=>{}
})
}

 public spent = [
    {
      name: 'Spent',
      series: [
        { name: '2019-12-01T00:00:00', value: 1234 },
        { name: '2019-12-15T00:00:00', value: 2000 },
        { name: '2019-12-31T00:00:00', value: 2500 },
        { name: '2019-01-01T00:00:00', value: 4000 },
        { name: '2019-01-15T00:00:00', value: 3400 },
        { name: '2019-01-31T00:00:00', value: 4200 },
        { name: '2019-02-01T00:00:00', value: 4500 },
        { name: '2019-02-15T00:00:00', value: 7637 },
        { name: '2019-02-29T00:00:00', value: 5637.78 }
      ]
    }
  ];

  public curve = curveCatmullRom;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

 

}


