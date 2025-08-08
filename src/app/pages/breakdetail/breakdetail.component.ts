import { ChangeDetectionStrategy, Component, Inject, InjectionToken, OnInit, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BreakAddComponent } from './break-add/break-add.component';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';


export  const Admin_TOKEN=new InjectionToken<ICommonService>('Admin_TOKEN');
@Component({
  selector: 'app-breakdetail',
  standalone: true,
  imports: [MatTableModule,MatFormFieldModule, MatInputModule,NgxMaterialTimepickerModule,BreakAddComponent],
  templateUrl: './breakdetail.component.html',
  styleUrl: './breakdetail.component.css',
  providers:[{
              provide: Admin_TOKEN,
              useClass: CommonService,
            }],
  // changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None // ← This disables style encapsulation

})
export class BreakdetailComponent implements OnInit {
  isModalVisible = false;
  displayedColumns: string[] = ['breakId', 'description','totalTime','isActive'];
 dataSource:any
constructor(@Inject(Admin_TOKEN) private _adminService: ICommonService){}
ngOnInit(): void {
    this._adminService.GetBreakDetail().subscribe({
      next: res => {
        console.log(res);
        this.dataSource =new MatTableDataSource<any>(res.Data); // Make sure res.Data is an array
      },
      error: err => {
        console.log(err);
      }
    });
  }
  onChildUpdated(){
     this._adminService.GetBreakDetail().subscribe({
      next: res => {
        console.log(res);
        this.dataSource =new MatTableDataSource<any>(res.Data); // Make sure res.Data is an array
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
