import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridApi, GridOptions, GridReadyEvent, PaginationChangedEvent, RowClickedEvent } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";
import { IPAycodeService } from '../../../Repository/GlobalMasters/Ipaycode.service';
import { PaycodeserviceService } from '../../../Service/GlobalMasters/paycodeservice.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { StateComponent } from '../../../common/state/state.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';

import { PaycodedragdropComponent } from './paycodedragdrop/paycodedragdrop.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
ModuleRegistry.registerModules([AllCommunityModule]);

const paycode_Token= InjectionToken<IPAycodeService>;
export interface IItemsMovedEvent {
  available: Array<{}>;
  selected: Array<{}>;
  movedItems: Array<{}>;
  from: 'selected' | 'available';
  to: 'selected' | 'available';
}
export interface paycodeItem {
  text: string;
  value?: any;   // optional if needed
}
@Component({
  selector: 'app-ptrule',
  imports: [AgGridAngular,StateComponent,CommonModule,MatCardModule,MatIconModule,FormsModule,PaycodedragdropComponent],
  templateUrl: './ptrule.component.html',
  styleUrl: './ptrule.component.css',
  providers: [
          {
              provide: paycode_Token,
              useClass: PaycodeserviceService,
          }
      ]
})
export class PTRuleComponent implements OnInit {
  PayCodeList:any;
datafields!: [

    { name: 'PTState_Ex_ID', type: 'int' },
    { name: 'State_Id', type: 'int' },
    { name: 'State_Name', type: 'string' },
    { name: 'Paycode_Id', type: 'int' },
    { name: 'Paycode_Code', type: 'string' },
    { name: 'Exclusion_Type', type: 'string' },
    { name: 'Exclusion_Type_Id', type: 'int' }
];
defaultColDef: ColDef = {
  sortable: false,
  filter: true,
  resizable: true,
  flex: 1
};
rowData = [];
columnDefs = [
  
  {
    headerName: 'PTState Ex ID',
    field: 'ptState_Ex_ID',
    hide: true
  },
  {
    headerName: 'State ID',
    field: 'state_Id',
    hide: true
  },
  {
    headerName: 'State',
    field: 'state_Name',
    flex: 1,
     filter: 'agTextColumnFilter',
    floatingFilter: true
  },
  {
    headerName: 'Paycode ID',
    field: 'paycode_Id',
    hide: true
  },
  {
  headerName: 'Paycode',
  field: 'paycode_Code',
  flex: 1,
  editable: true,
  filter: 'agTextColumnFilter',
  floatingFilter: true,
  cellEditor: 'agSelectCellEditor',
  cellEditorParams: () => ({
    values: this.paycodes.map(x => x.paycode_Code)
  })
},
  {
    headerName: 'Exclusion Type',
    field: 'exclusion_Type',
    flex: 1
  },
  {
    headerName: 'Exclusion Type ID',
    field: 'exclusion_Type_Id',
    hide: true
  }
];
theme = themeQuartz;
stateId!:Number;
SelectedStateId!:Number;
gridApi!: GridApi;
isAdd:boolean=false;
  selectedTemplate: string = '';
    availableItems: any[] = [];

  public gridOptions: GridOptions = {
    theme: 'legacy',// 👈 Force legacy theme mode,
    suppressHorizontalScroll: false,
    domLayout: 'normal',
    rowHeight: 28 // default is 25–32 depending on theme

  };
  paycodes:any;
  selectedPayCode:any[]=[];
  selectedPayCodes:any;
  userdetail:any;
  currentSelectItems:any;
  selectedItems:any;
constructor(@Inject(paycode_Token)private _paycodeService:IPAycodeService 
  ,private _decrypt:EncryptionService,
private _sessionStoreage:SessionStorageService){}
ngOnInit(): void {
  this.BindAllPTRule();
  this.BindPayCode();
}
IsAddPTRule():void{
  this.isAdd=true;
}
closeModal():void{
this.isAdd=false;
}
SearchWithState(){
const request={
      "Company_Id":this.stateId,
      "Band_Id":0,
      "param":0,
      "Flexi_Rule_Id":0
    }
 this._paycodeService.GetAllPTRule(request).subscribe({
  next:res=>{
   this.rowData=res.Data;
   
  },
  error:err=>{}
 })
}
getstate(event)
{  
this.rowData=[];
this.stateId=event.state_Id;
}
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    //this.updatePaginationInfo();
  }
onExportCsv(){
  this.gridApi.exportDataAsCsv({
  fileName: 'Report.csv'
});
}
getSelectedstate(event)
{
  this.BindPayCode();
this.SelectedStateId=event.state_Id;
}
  onItemsMoved(event): void {
    this.currentSelectItems = event.selected;
  }


  BindPayCode(): void {
    this._paycodeService.GetAllPTPayCode(0).subscribe({
      next: res => {
        this.paycodes = res.Data;
        
        this.availableItems = this.paycodes.map(x => ({
          value: x.paycode_Id,
          text: x.paycode_Code
        }));;
      },
      error: err => { }
    })
  }
  SaveData() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    //let count = this.rowData.filter(x => x.state_Id == this.SelectedStateId).length;
  
    if(this.SelectedStateId==0 || this.SelectedStateId==undefined||this.SelectedStateId==null)
    {
      alert('Please select state');
      return;
    }
    if (!this.currentSelectItems?.length) {
  alert('Please select atleast one paycode');
      return;
}
   

    const request = {
      "stateId": this.SelectedStateId,
      "selectedpaycode":this.currentSelectItems,
      "FlexiId": 0,
      "CreatedBy": this.userdetail.user_Id,
      "mode": "Add"
    }
    this._paycodeService.CreateFlexiState(request).subscribe({
      next: res => {
        if (res.Data) {
          alert(res.Data.error_Message);
          this.selectedPayCode=[];
          this.SelectedStateId=0;
          this.isAdd=false;
          this.BindAllPTRule();
        }
        else {
          alert("PT State Exclude Update Failed");
        }
        
      },
      error: err => { console.log(err) }
    })
  }
onPaycodeChange(paycode:any){
  //console.log(paycode)
//this.selectedPayCode=event;
}

BindAllPTRule(){
   const request={
      "Company_Id":0,
      "Band_Id":0,
      "param":0,
      "Flexi_Rule_Id":0
    }
 this._paycodeService.GetAllPTRule(request).subscribe({
  next:res=>{
   this.rowData=res.Data;
   
  },
  error:err=>{}
 })
}
}
