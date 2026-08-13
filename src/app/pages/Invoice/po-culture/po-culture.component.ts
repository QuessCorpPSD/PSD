import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyComponent } from '../../../common/company/company.component';
import { POCultureService } from '../../../Service/po-culture.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { finalize } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { POCultureAddpoComponent } from '../po-culture-addpo/po-culture-addpo.component';

interface ChildDetail {
  POCulture_id: number;
  Company_Id: number;
  Paycode_Id: number;
  Paycode_Code: string;
  HasAccess: boolean;
}

@Component({
  selector: 'app-po-culture',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    CompanyComponent,
    MatTooltipModule
  ],
  templateUrl: './po-culture.component.html',
  styleUrls: ['./po-culture.component.css']
})
export class PoCultureComponent implements AfterViewInit {

  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  isLoading: boolean = false;
  isTableVisible = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  companyUI: any;
  searchText: string = "";

  displayedColumns: string[] = [
    "delete",
    "poCulture_id",
    "company_Code",

    "map_Name",
    "isMapnameWiseInvoice",
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private poService: POCultureService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.company_Code?.toLowerCase().includes(searchText) ||
        data.company_Name?.toLowerCase().includes(searchText) ||
        data.invoiceCul_Ref_No?.toLowerCase().includes(searchText) ||
        data.invoiceType?.toLowerCase().includes(searchText) ||
        data.map_Name?.toLowerCase().includes(searchText)
      );
    };
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyUI = event.company;
  }

  AddPOOpen() {
    this.dialog.open(POCultureAddpoComponent, {
      width: '60%',
      height: '80vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  SearchClick() {
    if (!this.comapnyId) {
      alert('Please select a Company');
      return;
    }

    this.isLoading = true;
    this.isTableVisible = false;

    this.poService.GetAllPOCulture(this.comapnyId, this.userdetail.user_Id).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        this.isLoading = false;
        if (res.StatusCode === 200 && Array.isArray(res.Data) && res.Data.length > 0) {
          this.dataSource.data = res.Data;
          this.isTableVisible = true;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

        } else {
          this.dataSource.data = [];
          this.isTableVisible = false;
          alert("No Records Found");
        }
      },

      error: (err) => {
        this.isLoading = false;
        this.isTableVisible = false;
        console.error("API Error:", err);
        this.dataSource.data = [];
      }
    });
  }
  DownloadTemplate() {

    const templateData = [
      {
        Company_code: "", Map_Name: "", IsMapnameWiseInvoice: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'POCulture': ws },
      SheetNames: ['POCulture']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `POCulture_Template.xlsx`);
  }
  FileUpload(fileInput: HTMLInputElement): void {
    this.isLoading = true;
    fileInput.click();
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];

    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId',  this.userdetail.user_Id.toString());

      this.poService.UploadPOCulture(formData).subscribe({
        next: (res) => {
          this.datatable = res.Data;
          console.table(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "PoCulture_Validations");
            this.isLoading = false;
          } else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }
  downloadExcel(data: any[], templateId: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  deleteClick(poCulture_id: number) {
    if (confirm("Are you sure you want to delete this?")) {

      const parentDetail = {
        poCulture_id: poCulture_id,
        Company_Id: 0,
        Company_Code: '',
        Company_Name: '',
        Cost_Center_Mapping_Id: 0,
        Map_Name: '',
        Invoice_Category_Id: 0,
        Error_Message: ""
      }
 
     

      const PoCultureAdd = {
        createdBy: this.userdetail.user_Id,
        mode: 'Delete',
        parentDetail: parentDetail,
      }
      this.poService.postPOCulture(PoCultureAdd).subscribe({
        next: (res) => {
          const errormsg = res.Data.data.Table0[0].Error_Message;
          alert(errormsg);
          this.isLoading = true;
          this.SearchClick()
          error: err => {
            console.error('Error fetching data:', err.message);
            this.isLoading = false;
          }
        }
      });
    }
  }

  Export() {
    if (!this.comapnyId) {
      alert('Please select a Company');
      return;
    }

    this.isLoading = true;
    this.poService.ExportToExcel(this.comapnyId,this.userdetail.user_Id)
      .pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
          }
        },
        error: error => console.error('Error:', error)
      })
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

}
