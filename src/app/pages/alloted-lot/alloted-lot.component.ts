import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, InjectionToken, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {  } from '@angular/material/input';
import { SharepayregisterComponent } from './sharepayregister/sharepayregister.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../Shared/encryption.service';
import { TimerComponent } from './timer/timer.component';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { IAssignmentService } from '../../Repository/IAssignment.service';
import { AssignmentService } from '../../Service/Assignment.service';
import { LoadingService } from './progress/LoadingService ';
import { SessionStorageService } from '../../Shared/SessionStorageService';



const auth= InjectionToken<IAssignmentService>;
@Component({
  selector: 'app-alloted-lot',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,SharepayregisterComponent,TimerComponent,ReactiveFormsModule,MatStepperModule,MatButtonModule,MatInputModule],
  templateUrl: './alloted-lot.component.html',
  styleUrl: './alloted-lot.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
   providers: [
          {
            provide: auth,
            useClass: AssignmentService,
          }
        ],
  animations: [
    trigger('growOnHover', [
      state('default', style({
        transform: 'scale(1)'
        
      })),
      state('hovered', style({
        transform: 'scale(5,5)',
        backgroundColor: 'White',
        borderRadius: '2px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
        border:'1px solid #ccc',
        height:'15px',
        width:'10px',
        fontSize:'0.5em'
        
      })),
      transition('default <=> hovered', animate('300ms ease-in-out')),
    ])
  ]
})

export class AllotedLotComponent implements OnInit {

  isLinear:boolean=true;
  AllotmentForm!: FormGroup;
  lot: number | null = null;
  hc: string | null = '';
  companycode: string | null = '';
  category: string | null = '';
  estimateTime:string|null='';
  lotAssignment!:any ;
  bagroundColorCode:string='';
  TotalSecond!:number;
  RequestforModification:boolean=false;
  ishovered=false;
  sharepayregister:boolean=false;
  allotment:any=[];
  lotStatus:any;
  isLoading=false;
  isDisable=false;
  isPayDisable=false;
   allot:any=[];
   ismatching:boolean=false;
   isRevised:boolean=false;
   InputText:string="";
  constructor(private route:ActivatedRoute,
    private router:Router,
    private decry:EncryptionService,
    private loadingService:LoadingService,
    private _sessionStoreage:SessionStorageService ,
  @Inject(auth)private _authService:IAssignmentService,
  private fb: FormBuilder
  ) {

    this.AllotmentForm = this.fb.group({
      allotemt: this.fb.array([])
    });

  }
  GetIsmatch(ismatching):boolean
  {
    if (ismatching == 'Matching') {
      return true;
    }
    else{
      return false;
    }
  }
  GetAllotmentByLots():FormArray
{
  this.allot=this.AllotmentForm.get("allotemt") as FormArray;    
  return this.allot;
}
  GetAllotmenetDetail(val):FormGroup{
    
    const matchingstatus=this.GetMatchingText(val.ismatching,val.input_Headcount,val.output_Headcount)
  return this.fb.group({
     InputLot_Id: new FormControl(val.inputLot_Id),
     CategoryListName: new FormControl(val.input_Category),
     Input: new FormControl(val.input_Headcount),
     Output:new FormControl(val.output_Headcount),
     Mismatch:new FormControl(matchingstatus),     
     Remarks:new FormControl('')
  })
}

  ShareRegisterModelPopup(){
    this.sharepayregister=true;
  }
  closeModal(){
    this.sharepayregister=false;
  }
  downloadExcelFromBase64(base64: string, filename: string) {
      this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  PayregisterDownload()
  {
    this.isLoading=true;
   this.isPayDisable=true;
    this.loadingService.show();
   var request= {
      "companycode":this.lotAssignment.company_Id,
      "pay_period_Id":this.lotAssignment.pay_period_id,
      "lotNumber":this.lotAssignment.lot_Number,
      "payroll_input_type":this.lotAssignment.payroll_Input_Type,
      "pay_period":this.lotAssignment.pay_period
  }
  
    this._authService.ReconPayRegisterDownload(request).subscribe({
      next: res => { if(res.StatusCode==200){
        console.log(res.Data);
        const data=res.Data;
        var base64=data.file;
        this.downloadExcelFromBase64(base64,res.Data.fileName)
        this.isLoading=false;
        this.isPayDisable=false;
      }

      },
      error: error => { this.isLoading=false; console.error('Error:', error)}
    })
    this.GetLotStatus(this.lotAssignment.company_Id,this.lotAssignment.pay_period_id,this.lotAssignment.lot_Number,"R",this.lotAssignment.payroll_Input_Type,this.lotAssignment.createdOn);        
    this.loadingService.hide();
  }
ngOnInit(): void {
  
  this.route.queryParams.subscribe(params => {
    const item = params['items'];
    var param = this.decry.decrypt(item);    
    this.lotAssignment = JSON.parse(param);
    if(this.lotAssignment.revisedtime>0)
    {
      this.InputText="Revised Input"
      this.isRevised=true;
    }
    else{
       this.InputText="Input"
      this.isRevised=false;
    }
    this.GetAllotment(this.lotAssignment?.company_code,this.lotAssignment?.pay_period,this.lotAssignment?.lot_Number);
    this.GetAllotmentByLots();
    this.GetLotStatus(this.lotAssignment.company_Id,this.lotAssignment.pay_period_id,this.lotAssignment.lot_Number,"M",this.lotAssignment.payroll_Input_Type,this.lotAssignment.createdOn);    
    this.TotalSecond=this.convertToSeconds(this.lotAssignment!.estimate_time)
    this.Reqeustformodification();

  });
}



GetMatchingText(ismatch,output,input):string
{ 
  if (output == null || input == null) {
    return "Pending"
  }
  
  else {
    if (ismatch) {
      return "Matching"
    }
    else {
      this.RequestforModification=true;
      return "Variance"
    }
  }
}
QCVerifyButtonDisable(val)
{
  this.isDisable=val;
}
QCVerify(){
  this.isLoading=true;
  const user_id=this._sessionStoreage.getItem("userId");   
  this.isDisable=true;
const catg=this.AllotmentForm.get("allotemt")?.value;   
  var request={
    "Company_Id":this.lotAssignment.company_Id,
    "CompanyCode":this.lotAssignment.company_code,
    "Pay_Period":this.lotAssignment.pay_period,
    "pay_period_id":this.lotAssignment.pay_period_id,
    "lotnumber":this.lotAssignment.lot_Number,
    "UpdateStatus":"Q",
    "Payroll_Input_Type":this.lotAssignment.payroll_Input_Type,
    "createdon":this.lotAssignment.createdOn,
    "userId":user_id,
     "allotments":catg
}
  this._authService.QCLotVerify(request).subscribe({
    next: res => {
      console.log(res);
      this.lotStatus = res.Data;
      this.QCVerifyButtonDisable(res.Data.qC_Verified_Status);   
      if(res.Data.qC_Verified_Status)
      {
        this.downloadExcelFromBase64(this.lotStatus.fileResponse.file, "PayRegister");
      }   
      else{
         this.isLoading=false;
        window.alert("Pay Register not download");
      }
      
      
    },
    error: error =>{ this.isLoading=false; console.error('Error:', error)}
  });
}

InputDownload(){
  this.isLoading=true;
   
    this.loadingService.show();
   var request= {
      "companycode":this.lotAssignment.company_Id,
      "pay_period_Id":this.lotAssignment.pay_period_id,
      "lotNumber":this.lotAssignment.lot_Number,
      "InputType":this.lotAssignment.payroll_Input_Type
  }
    this._authService.InputFileDownload(request).subscribe({
      next: res => { if(res.StatusCode==200){
        const data=res.Data;
        var base64=data.file;
        this.downloadExcelFromBase64(base64,this.lotAssignment.lot_Number)
        this.isLoading=false;
      }

      },
      error: error => console.error('Error:', error)
    })

}
GetLotStatus(Company_Id,pay_period_id,lotnumber,UpdateType,payroll_Input_Type,createdOn){
  const user_id=this._sessionStoreage.getItem("userId"); 
  var request={
    "Company_Id":Company_Id,
    "pay_period_id":pay_period_id,
    "lotnumber":lotnumber,
    "UpdateStatus":UpdateType,
    "Payroll_Input_Type":payroll_Input_Type,
    "createdOn":createdOn,
    "userId":user_id
};

  this._authService.LotStatus(request).subscribe({
    next: res => { this.lotStatus = res.Data;
      this.QCVerifyButtonDisable(res.Data.qC_Verified_Status);
    },
    error: error => console.error('Error:', error)
  });
}

GetAllotment(companyCode,payPeriod,lot)
{

  var request={
    "companyCode":companyCode,
    "payPeriod":payPeriod,
    "lot":lot
  }
  this._authService.GetAllotment(request).subscribe({
    next: res => {
      // if(this.lotAssignment.payroll_Input_Type =="Other Input")
      // {
      //   this.isPayDisable = true;
      // }
      // else {
      //   this.isPayDisable = false;
      // }
      
      this.allotment = res.Data;
      this.allotment.forEach(element => {
        this.allot.push(this.GetAllotmenetDetail(element));
      });

    },
    error: error => console.error('Error:', error)
  });
  

}
RequestForRevised(lotAllocated):void{
  this.isLoading=true;
  const user_id=this._sessionStoreage.getItem("userId");   
  this.isDisable=true;
const catg=this.AllotmentForm.get("allotemt")?.value;   
  var request={
    "Company_Id":this.lotAssignment.company_Id,
    "CompanyCode":this.lotAssignment.company_code,
    "Pay_Period":this.lotAssignment.pay_period,
    "pay_period_id":this.lotAssignment.pay_period_id,
    "lotnumber":this.lotAssignment.lot_Number,
    "UpdateStatus":"R",
    "Payroll_Input_Type":this.lotAssignment.payroll_Input_Type,
    "createdon":this.lotAssignment.createdOn,
    "userId":user_id,
    "allotments":catg
}
  this._authService.QCLotVerify(request).subscribe({
    next: res => {
      
      
      this.lotStatus = res.Data;
      
      // if(res.Data.qC_Verified_Status)
      // {
      //   this.QCVerifyButtonDisable(res.Data.qC_Verified_Status);
      //   this.downloadExcelFromBase64(this.lotStatus.fileResponse.file, "PayRegister");
      // }
      // else{
      //   window.alert("Pay Register not download")
      // }
      
      
    },
    error: error =>{ this.isLoading=false; console.error('Error:', error)}
  });
  

}

PayResgisterDownload(){

}
SharedPayRegisterUpload()
{

}
convertToSeconds(time: number): number {
  // const parts = time.split(':');
 
  // if (parts.length !== 3) return 0;

  // const [h, m, s] = parts.map(Number);
  // if (isNaN(h) || isNaN(m) || isNaN(s)) return 0;

  // return h * 3600 + m * 60 + s;

  const seconds = time * 60;

 return  seconds;
   
}
  Reqeustformodification() {
    // if (this.lotAssignment?.newJoinee.ismatching && this.lotAssignment?.attendance.ismatching &&
    //   this.lotAssignment?.adhoc.ismatching && this.lotAssignment?.increment && this.lotAssignment?.otherInput.ismatching) {
      this.RequestforModification = false;
    //}
  }
RetuenHome(){
  this.router.navigate(['/Master/Assignment'])
}


   
}

export interface LotAllotmentStatus { 
  InputLot_Id:number;
  company_Code: string;
  company_name: string;
  pay_period:string;
  lot_Number: number;
  payroll_Input_Type: string;
  revisedtime: string;
  assignment:string;  
  headCount: string;
  category: string;
  estimateTime:string;
}



