import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatCardModule, MatCardTitle } from "@angular/material/card";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { IGenericUpload } from '../../../Repository/BankInvoice/IgenericUpload';
import { GenericUploadService } from '../../../Service/BankInvoice/generic-upload.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
export const Pay_TOKEN = new InjectionToken<IGenericUpload>('Pay_TOKEN');

@Component({
  selector: 'app-genericupload',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule],
  templateUrl: './genericupload.component.html',
  styleUrl: './genericupload.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GenericUploadService,
    }
  ]
})
export class GenericuploadComponent {
  userdetail: any;
  Uploadtype: any[] = [];
  selectedUploadType: any = '';
  selectedUploadTypeName: string = '';
  isLoading: boolean = false;



  constructor(
    private dialog: MatDialog,
    @Inject(Pay_TOKEN) private service: IGenericUpload, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }



  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindUploadtype();
  }

  BindUploadtype() {
    const userId = this.userdetail.user_Id;
    this.service.getUploadType(userId).subscribe({
      next: (res) => {
        this.Uploadtype = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Error loading upload types", err);
      }
    });
  }
  DownloadTemplate() {

    if (!this.selectedUploadType) {
      alert("Please select Upload Type");
      return;
    }

    const uploadTypeTrim = this.selectedUploadType.replace(/\s/g, '');

    this.service.downloadTemplate(uploadTypeTrim)
      .subscribe({
        next: (res) => {
          const data = res?.Data?.data?.Table0;

          if (!data || data.length === 0) {
            alert("No template data found");
            return;
          }

    
          const headers = Object.keys(data[0]);
          const dummyRow: any = {};
          headers.forEach(h => dummyRow[h] = "");

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([dummyRow]);
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

          XLSX.writeFile(workbook, uploadTypeTrim + "_Template.xlsx");
        },
        error: (err) => {
          console.error("Download failed", err);
          alert("Download failed");
        }
      });
  }
  onUploadTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;

    this.selectedUploadType = value;
    this.selectedUploadTypeName = value;
  }
  ImportClick(fileInput: HTMLInputElement): void {
    if (!this.selectedUploadTypeName) {
      alert('Please select Upload Type');
      return;
    }

    fileInput.value = ''; 
    fileInput.click();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please select an Excel file.');
      return;
    }

    if (!this.selectedUploadTypeName) {
      alert('Please select Upload Type');
      return;
    }

    const formData = new FormData();


    formData.append('file', file);
    formData.append('uploadType', this.selectedUploadTypeName);
    formData.append('createdBy', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.Upload(formData)
      .subscribe({
        next: (res: any) => {

          this.isLoading = false;
          const response = res?.Data?.response;
          const errors = res?.Data?.errors;
          if (response) {
            alert(response);

            if (errors && errors.length > 0) {

              let errorArray: any[] = [];

              try {
                const rawErr = errors[0];

                if (typeof rawErr === 'string') {
                  errorArray = JSON.parse(rawErr);
                } else if (Array.isArray(rawErr)) {
                  errorArray = rawErr;
                } else {
                  errorArray = [rawErr];
                }

              } catch {
                errorArray = [{ Error: String(errors[0]) }];
              }

              this.downloadErrorExcel(errorArray);
            }

            return;
          }
          alert('Unexpected response from server');
        },

        error: (err) => {
          this.isLoading = false;
          console.error('Upload failed', err);
          alert('Upload failed due to server error');
        }
      });
  }
  downloadErrorExcel(errorArray: any[]): void {

    if (!errorArray || errorArray.length === 0) {
      alert('No error details available');
      return;
    }

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(errorArray);

    const workbook: XLSX.WorkBook = {
      Sheets: { Errors: worksheet },
      SheetNames: ['Errors']
    };

    XLSX.writeFile(
      workbook,
      `${this.selectedUploadTypeName || 'Errors'}_Errors.xlsx`
    );
  }
}
