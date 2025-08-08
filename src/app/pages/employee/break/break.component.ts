import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
export  const Admin_TOKEN=new InjectionToken<ICommonService>('Admin_TOKEN');
@Component({
  selector: 'app-break',
  standalone: true,
  imports: [CommonModule,FormsModule,MatTableModule,MatInputModule,MatIconModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './break.component.html',
  styleUrl: './break.component.css',
    providers:[{
                provide: Admin_TOKEN,
                useClass: CommonService,
              }]
})

export class BreakComponent implements OnInit {

  dataSource:any;
  displayedColumns: string[] = ['description',  'startTime','endTime','remarks','actions'];
  editIndex: number | null = null;
  editableRow: any = {};
  constructor(@Inject(Admin_TOKEN) private _adminService: ICommonService){}
  ngOnInit(): void {
    //this._adminService.
  }
  editRow(index: number) {
    this.editIndex = index;
    this.editableRow = { ...this.dataSource[index] };
  }

  saveRow(index: number) {
    this.dataSource[index] = this.editableRow;
    this.dataSource = [...this.dataSource]; // Refresh table
    this.cancelEdit();
  }
  getBreakDetailByEmployee(){

  }

  cancelEdit() {
    this.editIndex = null;
    this.editableRow = {};
  }
}
