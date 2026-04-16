import { CommonModule } from '@angular/common';
import { Component, SimpleChanges, Inject, InjectionToken, ViewChild, ElementRef, } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCardModule } from '@angular/material/card';
import { ISEZRepositoryService } from '../../../Repository/invoice/iSEZRepository.service';
import { SEZRepositoryService } from '../../../Service/invoice/SEZRepository.service';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';

const sezservice = InjectionToken<ISEZRepositoryService>;

interface ViewRow {
  serial_No: number;
  id: number;
  company_Id: number;
  company_Code: string;
  document_Name; string;
  ackNo: string;
  valid_From: string;
  valid_To: string;
  uploaded_Date: string;
  document_FilePath: string;
  document_Remarks: string;
  requestedBy: string;
  approvalStatus: string;
  uploadStatus: string;
}

@Component({
  selector: 'sezcertificateupload',
  imports: [CommonModule, MatTableModule, MatCardModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatRadioModule, MatIconModule, CompanyallComponent, MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './sezcertificateupload.component.html',
  styleUrl: './sezcertificateupload.component.css',
  providers: [
    { provide: sezservice, useClass: SEZRepositoryService }]
})
export class SezcertificateuploadComponent {
  selectedCC?: number;
  companyUI: any;
  userdetail!: any;
  filteredRows: any[] = [];
  Company_Code?: string;
  searchText: string = '';
  rows: ViewRow[] = [];
  isaddclicked = false;
  selectedFileName: string = "";
  remarksText: string = "";
  ACKNoText: string = "";
  validFrom?: Date;
  validTo?: Date;
  showTable = false;
  isLoading = false;
  searchInvoiceNumber: string = '';
  remarkText?: string;
  selectedFile: File | null = null;
  uploadedFileUrl: string | null = null;
  selectedCompanyId!: number;
  displayedColumns: string[] = [
    //'select',
    //'delete',
    'company_Code',
    'document_Name',
    'ackNo',
    'valid_From',
    'valid_To',
    'uploaded_Date',
    'document_Remarks',
    'requestedBy'
  ];

  constructor(private _sessionStoreage: SessionStorageService, private decry: EncryptionService, private router: Router, public fb: FormBuilder
    , @Inject(sezservice) private sezService: ISEZRepositoryService
  ) {

  }

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  selection = new SelectionModel<any>(true, []);

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id
      )
    );
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numFilteredRows = this.dataSource.filteredData.length;

    return numFilteredRows > 0 && numSelected === numFilteredRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.clear(); // avoid mixing previous selections
      this.dataSource.filteredData.forEach(row =>
        this.selection.select(row)
      );
    }
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };

    this.companyUI = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredRows = [...this.rows];
  }


  searchClick() {


    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = true;
    const companyId = this.companyUI?.companyId || 0;

    this.sezService.SearchSEZCertificate(companyId).subscribe({
      next: res => {
        //console.log('Search', res);
        const tableData = res.Data;
        if (!tableData || tableData.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        //console.log('tableData', tableData);
        this.dataSource = new MatTableDataSource<any>(tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  handleCompanyEvent(company: any) {
    if (company) {
      this.companyUI = company;
      this.Company_Code = company.company_Code;
      this.selectedCompanyId = company.companyId;
      console.log('company', this.selectedCompanyId);

      if (!this.companyUI) {
        alert("Select Company Code");
        return;
      }
    }
  }

  AddClick() {
    if (this.companyUI.length == 0) {
      alert("Please select Company");
      return;
    }
    this.isaddclicked = true;
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
  SubmitDoc(): void {

    if (!this.validFrom) {
      alert('Please Select Valid From Date ❌');
      return;

    } if (!this.validTo) {
      alert('Please Select Valid To Date ❌');
      return;
    }
    if (!this.remarkText || !this.remarkText.trim()) {
      alert('Please enter Remarks ❌');
      return;
    }
    if (!this.ACKNoText || !this.ACKNoText.trim()) {
      alert('Please enter Acknowledgement No ❌');
      return;
    }
    if (!this.selectedFile) {
      alert('Please upload SEZ document ❌');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('companyId', this.companyUI.companyId.toString());
    formData.append('userId', this.userdetail.user_Id);
    formData.append('validFrom', this.formatDate(this.validFrom));
    formData.append('validTo', this.formatDate(this.validTo));
    formData.append('remarks', this.remarkText.trim());
    formData.append('AckNo', this.ACKNoText.trim());
    formData.append('file', this.selectedFile, this.selectedFile.name);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.sezService.UploadSEZCertificate(formData).subscribe({
      next: (res: any) => {
        const resultString = res.Data.message.result;
        let errorMessage = '';
        try {
          const parsed = JSON.parse(resultString);
          errorMessage = parsed?.[0]?.Error_Message || '';
        } catch (e) {
          console.error('Parsing failed', e);
        }

        alert(errorMessage);
        this.searchClick();
        this.selection.clear();

        this.remarkText = '';
        this.selectedFile = null;
        this.isaddclicked = false;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.isaddclicked = false;
        console.error(err);
        alert('Upload failed. Please try again.');
        this.searchClick();
      }
    });
  }


  Cancel() {
    this.remarksText = ''
    this.selectedFileName = ''
    this.isaddclicked = false;
  }

  deleteRow(row: ViewRow) {
    const confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      this.rows = this.rows.filter(r => r !== row);
      this.filteredRows = [...this.rows];
    }
  }

  downloadFile(Id: number) {
    if (!Id) return;

    this.isLoading = true;

    this.sezService.GetUploadedCertificate(Id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName);
          } else {
            alert("File Path not found!");
          }
        },
        error: error => {
          console.error('Error:', error);
        }
      });
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    // this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    // Create local download URL
    this.uploadedFileUrl = URL.createObjectURL(file);
  }


  removeUploadedFile() {
    if (this.uploadedFileUrl) {
      URL.revokeObjectURL(this.uploadedFileUrl);
    }

    this.selectedFile = null;
    this.uploadedFileUrl = null;

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  closeclick() {
    this.removeUploadedFile();
    this.remarkText = "";
    this.ACKNoText = "";
    this.validFrom = undefined;
    this.validTo = undefined;
    this.isaddclicked = false;
  }

}
