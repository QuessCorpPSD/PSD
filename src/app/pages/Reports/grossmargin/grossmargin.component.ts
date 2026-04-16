import { Component, Inject, InjectionToken } from '@angular/core';
import { Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IreportService } from '../../../Repository/Reports/Ireportservice';
import { ReportService } from '../../../Service/Reports/report.service';
import { PayperiodallComponent } from '../../../common/PayperiodAll/payperiodall.component';



export const Invoice_TOKEN = new InjectionToken<IreportService>('Invoice_TOKEN');
@Component({
  selector: 'app-grossmargin',
  imports: [CommonModule,CompanyallComponent,PayPeriodComponent,PayperiodallComponent],
  templateUrl: './grossmargin.component.html',
  styleUrl: './grossmargin.component.css',
  providers: [
  
      {
        provide: Invoice_TOKEN,
        useClass: ReportService
      }]
})
export class GrossmarginComponent {
  selectedCompanyId!: number;
    payPeriod!: Payperiodclass;
    downloadpayPeriod!: string;
    payPeriodType: string='All';
    userdetail!:any;
    isLoading=false;
    selectedFile: File | null = null;
    base64Data!:any;
    FileName!:any;
    uploadProgress: number | null = null;
     constructor(private _decrypt:EncryptionService,
  private _sessionStoreage:SessionStorageService,
 @Inject(Invoice_TOKEN) private reportServices: IreportService
){

  }
 handleCompanyEvent(company)
  {
    this.selectedCompanyId = company.companyId;
  }
  handlePayperiodEvent(payperiod: Payperiodclass){
    this.payPeriod = payperiod;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
      this.payPeriodType = "All";
  }
    downloadExcelFromBase64(base64: string, filename: string) {
      this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.convertToBase64(this.selectedFile);
    }
  }
  convertToBase64(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result as string;
    const base64Only = base64String.split(',')[1];
    
    this.base64Data = base64Only;
    this.FileName = base64String.split(',')[0];
   
  };
  reader.readAsDataURL(file);
}
  
isDragging = false;



// Drag events
onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}
          handleFrequencyEvent(frequency: any) {
      console.log('frequency', frequency);
     this.downloadpayPeriod =frequency.pay_Period
  } 
onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;

  if (event.dataTransfer?.files.length) {
    this.selectedFile = event.dataTransfer.files[0];
  }
}

// Remove file
removeFile() {
  this.selectedFile = null;
}
  uploadFile() {

    if (!this.selectedFile) {
      alert('Select The File')
      return;
    }
    if(this.selectedCompanyId==undefined)
    {
      alert('Select the Company');
      return;
    }
    if(this.payPeriod==undefined)
    {
      alert('Select the Period');
      return;
    }
    this.isLoading=true;
    const request={
      "CompanyId":this.selectedCompanyId,
      "PayPeriodId":this.payPeriod.payfrequencyid,
      "CreatedBy":3,
      "File":this.base64Data,
      "FileName":this.FileName
    }
    this.reportServices.Accuralsupload(request).subscribe({
      next:res=>{
          const response=res.Data;
          if(response.statusCode==200)
          {
            alert(response.statusMessage);
            this.isLoading=false;
            this.selectedFile=null;
          }
          else {
            alert(response.statusMessage);
            this.isLoading = false;
          }
      },
      error:err=>{
        this.isLoading=false;
      }
    })
  }
  downloadReport() {
    if(this.downloadpayPeriod==null|| this.downloadpayPeriod==undefined)
    {
      alert('Please select Pay period');
      return;
    }
    const request = {
      "Pay_Period": this.downloadpayPeriod,
      "ReportType":"GM",
      "Submit": 0
    }
    this.isLoading=true;
    this.reportServices.GrossMarginReport(request).subscribe({
      next: ({ Data }) => {
        // directly destructured
        console.log(Data);
        this.downloadExcelFromBase64(Data.file,Data.fileName)
        //this.handleReport(Data);
      },
      error: (err) => {
        console.error('Error fetching Gross Margin Report:', err);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
  AccouralTemplateDownload(){
    this.reportServices.AccuralTemplate().subscribe({
      next:res=>{
          const files=res.Data;         
         this.downloadExcelFromBase64(files.file,files.fileName)
      }
    })
  }
   unprosseddownloadReport() {
    if(this.downloadpayPeriod==null|| this.downloadpayPeriod==undefined)
    {
      alert('Please select Pay period');
      return;
    }
    const request = {
      "Pay_Period": this.downloadpayPeriod,
      "ReportType":"UGM",
      "Submit": 0
    }
    this.isLoading=true;
    this.reportServices.GrossMarginReport(request).subscribe({
      next: ({ Data }) => {
      
        this.downloadExcelFromBase64(Data.file,Data.fileName)
        //this.handleReport(Data);
      },
      error: (err) => {
        console.error('Error fetching Gross Margin Report:', err);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
}
