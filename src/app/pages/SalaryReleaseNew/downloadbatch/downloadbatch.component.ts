import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { IBatchreation } from '../../../Repository/SalaryRequestNew/Ibatchcreation';
import { BatchcreationService } from '../../../Service/SalaryRequestNew/batchcreation.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
export const Pay_TOKEN = new InjectionToken<IBatchreation>('Pay_TOKEN');

@Component({
  selector: 'app-downloadbatch',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent],
  templateUrl: './downloadbatch.component.html',
  styleUrl: './downloadbatch.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BatchcreationService,
    }
  ]
})
export class DownloadbatchComponent {
  BatchDate: any;
  BatchId: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading = false;
  searchText = '';
  selectedTemplate: any;
  userdetail: any;
  batchtype: any;
  dataSource = new MatTableDataSource<any>([]);
  Batchtype: string = '';
  batchid: any;

  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_TOKEN) private service: IBatchreation,) { }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filter = filterValue;

  }
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.Bindbatchtype();

  }

  Bindbatchtype() {
    this.service.Batchtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchtype = res.Data }
    });
    // this.BindbatchId();
  }
  loadBatchId() {
    if (!this.batchid || this.batchid.length === 0) {
      this.BindbatchId();
    }
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  BindbatchId() {

    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.BatchDate) {
      alert("Please Select BatchDate");
      return;
    }

    const formattedDate = this.formatDate(this.BatchDate);
    console.log('date', formattedDate)
    this.service.BatchId(
      this.Batchtype,
      formattedDate,
      this.userdetail.user_Id
    ).subscribe({
      next: res => {
        this.batchid = res.Data;
      }
    });
  }
  Downloadbatch(): void {

    if (!this.BatchId) {
      alert("Please Select BatchID");
      return;
    }

    this.isLoading = true;

    this.service.Downloadbatchfile(this.BatchId).subscribe({

      next: (response: any) => {
        this.isLoading = false;

        const blob = response.body;

        // Get filename from backend header
        let fileName = this.BatchId + '.rar'; 

        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);

        alert('RAR file downloaded successfully!');
      },

      error: (err) => {
        console.error('Error downloading file', err);
        this.isLoading = false;
        alert('Error while downloading file');
      }
    });
  }



}
