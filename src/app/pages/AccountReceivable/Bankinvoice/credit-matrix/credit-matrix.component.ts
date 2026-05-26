import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { ICreditNoteMatrix } from '../../../../Repository/BankInvoice/BankInvoiceRepository/ICreditNoteMatrix';

import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CreditNoteMatrixService } from '../../../../Service/BankInvoice/BankInvoiceService/credit-note-matrix.service';


export const Common_TOKEN = new InjectionToken<ICreditNoteMatrix>('Common_TOKEN');
@Component({
  selector: 'app-credit-matrix',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './credit-matrix.component.html',
  styleUrl: './credit-matrix.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: CreditNoteMatrixService }
  ],
})
export class CreditMatrixComponent {

  searchText: string = '';
  isLoading = false;
  userdetail!: any;
  user_Id: any;
  dataSource = new MatTableDataSource<any>([]);
  creditMatrixForm!: FormGroup;
  isEditMode = false;
  editSNo: number = 0;
  crnCategoryList: any[] = [];

  showCreditPopup = false;

  approvalRoles = [
    'PPT',
    'ZM',
    'BillingHead',
    'BF',
    'COO',
    'CEO',
    'WCFO',
    'President'
  ];


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private fb: FormBuilder,
    private service: CreditNoteMatrixService
  ) { }


  displayedColumns: string[] = [
    "delete",
    "edit",
    'SNo',
    'CRNCategory',
    'PPT',
    'PPTUserId',
    'PPTMailId',
    'ZM',
    'ZMUserId',
    'ZMMailId',
    'BillingHead',
    'BillingHeadUserId',
    'BillingHeadMailId',
    'BF',
    'BFUserId',
    'BFMailId',
    'COO',
    'COOUserId',
    'COOMailId',
    'CEO',
    'CEOUserId',
    'CEOMailId',
    'CFO',
    'WCFOUserId',
    'WCFOMailId',
    'President',
    'PresidentUserId',
    'PresidentMailId',
    'Isactive',
    'CreatedBy',
    'CreatedOn',
    'ModifiedBy',
    'Modified'

  ];

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.creditMatrixForm = this.fb.group({

      CRNCategory: ['', Validators.required],

      PPT: [false, Validators.required],
      PPTUserId: [''],
      PPTMailId: [''],

      ZM: [false, Validators.required],
      ZMUserId: [''],
      ZMMailId: [''],

      BillingHead: [false, Validators.required],
      BillingHeadUserId: [''],
      BillingHeadMailId: [''],

      BF: [false, Validators.required],
      BFUserId: [''],
      BFMailId: [''],

      COO: [false, Validators.required],
      COOUserId: [''],
      COOMailId: [''],

      CEO: [false, Validators.required],
      CEOUserId: [''],
      CEOMailId: [''],

      WCFO: [false, Validators.required],
      WCFOUserId: [''],
      WCFOMailId: [''],

      President: [false, Validators.required],
      PresidentUserId: [''],
      PresidentMailId: ['']

    });
    this.getCRNCategory();
    this.approvalRoles.forEach(role => {
      this.creditMatrixForm.get(role + 'UserId')?.disable();
      this.creditMatrixForm.get(role + 'MailId')?.disable();
    });
    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const searchText = filter.toLowerCase();

      return (

        data.SNo?.toString().toLowerCase().includes(searchText) ||

        data.CRNCategory?.toLowerCase().includes(searchText) ||

        data.PPTUserId?.toString().toLowerCase().includes(searchText) ||

        data.PPTMailId?.toLowerCase().includes(searchText) ||

        data.ZMUserId?.toString().toLowerCase().includes(searchText) ||

        data.ZMMailId?.toLowerCase().includes(searchText) ||

        data.BillingHeadUserId?.toString().toLowerCase().includes(searchText) ||

        data.BillingHeadMailId?.toLowerCase().includes(searchText) ||

        data.BFUserId?.toString().toLowerCase().includes(searchText) ||

        data.BFMailId?.toLowerCase().includes(searchText) ||

        data.COOUserId?.toString().toLowerCase().includes(searchText) ||

        data.COOMailId?.toLowerCase().includes(searchText) ||

        data.CEOUserId?.toString().toLowerCase().includes(searchText) ||

        data.CEOMailId?.toLowerCase().includes(searchText) ||

        data.WCFOUserId?.toString().toLowerCase().includes(searchText) ||

        data.WCFOMailId?.toLowerCase().includes(searchText) ||

        data.PresidentUserId?.toString().toLowerCase().includes(searchText) ||

        data.PresidentMailId?.toLowerCase().includes(searchText)

      );

    };
  }
  applyFilters() {

    const filterValue =
      this.searchText?.trim().toLowerCase();

    this.dataSource.filter = filterValue;

  }

  closeCreditPopup() {

    this.showCreditPopup = false;

    this.isEditMode = false;

    this.editSNo = 0;

    this.creditMatrixForm.reset();

  }

  onRoleChange(role: string) {

    const isChecked = this.creditMatrixForm.get(role)?.value;
    const userIdControl = this.creditMatrixForm.get(role + 'UserId');
    const mailIdControl = this.creditMatrixForm.get(role + 'MailId');

    if (isChecked) {
      userIdControl?.enable();
      mailIdControl?.enable();
    } else {
      userIdControl?.disable();
      mailIdControl?.disable();

      userIdControl?.reset();
      mailIdControl?.reset();
    }
  }



  onEditRow(row: any) {

    this.isEditMode = true;

    this.editSNo = row.SNo;

    this.showCreditPopup = true;

    this.creditMatrixForm.patchValue({

      CRNCategory: row.CRNCategory,

      PPT: row.PPT,
      PPTUserId: row.PPTUserId,
      PPTMailId: row.PPTMailId,

      ZM: row.ZM,
      ZMUserId: row.ZMUserId,
      ZMMailId: row.ZMMailId,

      BillingHead: row.BillingHead,
      BillingHeadUserId: row.BillingHeadUserId,
      BillingHeadMailId: row.BillingHeadMailId,

      BF: row.BF,
      BFUserId: row.BFUserId,
      BFMailId: row.BFMailId,

      COO: row.COO,
      COOUserId: row.COOUserId,
      COOMailId: row.COOMailId,

      CEO: row.CEO,
      CEOUserId: row.CEOUserId,
      CEOMailId: row.CEOMailId,

      WCFO: row.WCFO,
      WCFOUserId: row.WCFOUserId,
      WCFOMailId: row.WCFOMailId,

      President: row.President,
      PresidentUserId: row.PresidentUserId,
      PresidentMailId: row.PresidentMailId

    });

    this.approvalRoles.forEach(role => {

      if (row[role]) {

        this.creditMatrixForm.get(role + 'UserId')?.enable();

        this.creditMatrixForm.get(role + 'MailId')?.enable();

      } else {

        this.creditMatrixForm.get(role + 'UserId')?.disable();

        this.creditMatrixForm.get(role + 'MailId')?.disable();

      }

    });

  }

  onDeleteRow(row: any) {

    if (!confirm('Are you sure want to delete?')) {

      return;
    }

    this.isLoading = true;

    const payload = {

      createdBy: this.userdetail?.UserId || 1,

      requestdata: [

        {
          SNo: row.SNo
        }

      ]

    };

    this.service.Delete(payload)
      .subscribe({

        next: (res: any) => {

          console.log('Delete Response', res);

          alert(
            res?.Data?.[0]?.message ||
            res?.Message ||
            'Deleted Successfully'
          );

          this.closeCreditPopup();

          setTimeout(() => {

            this.search();

          }, 500);

          this.isLoading = false;
        },

        error: (err) => {

          console.error(err);

          alert(
            err?.error?.Message ||
            'Delete Failed'
          );

          this.isLoading = false;
        }

      });

  }
  saveCreditMatrix() {

    // if (this.creditMatrixForm.invalid) {

    //   if (!this.creditMatrixForm.get('CRNCategory')?.value) {

    //     alert('Please select the CRN Category');

    //   }

    //   this.creditMatrixForm.markAllAsTouched();

    //   return;
    // }

    this.isLoading = true;

    const payload = {

      createdBy: this.userdetail?.UserId || 1,

      requestdata: [

        {

          SNo: this.editSNo,

          CRNCategory: this.creditMatrixForm.value.CRNCategory,

          PPT: this.creditMatrixForm.value.PPT,
          PPTUserId: this.creditMatrixForm.value.PPTUserId,
          PPTMailId: this.creditMatrixForm.value.PPTMailId,

          ZM: this.creditMatrixForm.value.ZM,
          ZMUserId: this.creditMatrixForm.value.ZMUserId,
          ZMMailId: this.creditMatrixForm.value.ZMMailId,

          BillingHead: this.creditMatrixForm.value.BillingHead,
          BillingHeadUserId: this.creditMatrixForm.value.BillingHeadUserId,
          BillingHeadMailId: this.creditMatrixForm.value.BillingHeadMailId,

          BF: this.creditMatrixForm.value.BF,
          BFUserId: this.creditMatrixForm.value.BFUserId,
          BFMailId: this.creditMatrixForm.value.BFMailId,

          COO: this.creditMatrixForm.value.COO,
          COOUserId: this.creditMatrixForm.value.COOUserId,
          COOMailId: this.creditMatrixForm.value.COOMailId,

          CEO: this.creditMatrixForm.value.CEO,
          CEOUserId: this.creditMatrixForm.value.CEOUserId,
          CEOMailId: this.creditMatrixForm.value.CEOMailId,

          WCFO: this.creditMatrixForm.value.WCFO,
          WCFOUserId: this.creditMatrixForm.value.WCFOUserId,
          WCFOMailId: this.creditMatrixForm.value.WCFOMailId,

          President: this.creditMatrixForm.value.President,
          PresidentUserId: this.creditMatrixForm.value.PresidentUserId,
          PresidentMailId: this.creditMatrixForm.value.PresidentMailId

        }

      ]

    };

    console.log('Payload', JSON.stringify(payload, null, 2));

    const apiCall = this.isEditMode
      ? this.service.Update(payload)
      : this.service.Create(payload);

    apiCall.subscribe({

      next: (res: any) => {

        console.log('Response', res);

        alert(
          res?.Data?.[0]?.message ||
          res?.Message ||
          'Success'
        );

        this.closeCreditPopup();

        setTimeout(() => {

          this.search();

        }, 500);

        this.isLoading = false;

        this.isEditMode = false;

        this.editSNo = 0;
      },

      error: (err) => {

        console.error('Error', err);

        alert(
          err?.error?.Message ||
          'Operation Failed'
        );

        this.isLoading = false;
      }

    });

  }

  openCreditPopup() {

    this.isEditMode = false;

    this.editSNo = 0;

    this.creditMatrixForm.reset();

    this.approvalRoles.forEach(role => {

      this.creditMatrixForm.get(role)?.setValue(false);

      this.creditMatrixForm.get(role + 'UserId')?.disable();

      this.creditMatrixForm.get(role + 'MailId')?.disable();

    });

    this.showCreditPopup = true;

  }
  search() {

    this.isLoading = true;

    this.service.Search()
      .subscribe({

        next: (res: any) => {

          console.log('Search Response', res);

          const tableData = res?.Data?.data?.Table0 || [];

          if (tableData.length === 0) {

            alert('No data found');

            this.dataSource.data = [];

            this.isLoading = false;

            return;
          }

          this.dataSource = new MatTableDataSource(tableData);

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;

          console.log('Table Data', tableData);

          this.isLoading = false;
        },

        error: (err) => {

          console.error('Search Error', err);

          alert('Error while fetching data');

          this.isLoading = false;
        }

      });

  }

  exportToExcel(): void {

    this.isLoading = true;

    this.service.ExportToExcel()
      .subscribe({

        next: (res: any) => {

          this.isLoading = false;

          console.log('Export Response', res);

          const jsonData = res?.Data?.data?.Table0 || [];

          if (jsonData.length === 0) {

            alert('No data available');

            return;
          }

          const ws: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(jsonData);

          const wb: XLSX.WorkBook =
            XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            'CreditNoteMatrix'
          );

          const date =
            new Date().toISOString().split('T')[0];

          const fileName =
            `CreditNoteMatrix_${date}.xlsx`;

          XLSX.writeFile(wb, fileName);

        },

        error: (err) => {

          this.isLoading = false;

          console.error('Export Error', err);

          alert('Export failed');

        }

      });

  }

  getCRNCategory(): void {

    this.service
      .GetCommonDropDownList(
        'CreditNoteType',
        this.userdetail?.user_Id
      )
      .subscribe({

        next: (res: any) => {

          console.log(res);

          this.crnCategoryList =
            res?.Data || [];

        },

        error: (err) => {

          console.error(err);

        }

      });

  }



}
