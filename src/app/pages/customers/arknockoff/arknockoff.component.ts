import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, AfterViewInit, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';

import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { ARKnockoffService } from '../../../Service/CUSTOMER/arknockoff.service';
import { IARKnockoffRepository } from '../../../Repository/customer/IARknockOffRepository';
const Pay_TOKEN = new InjectionToken<IARKnockoffRepository>('Pay_TOKEN');

@Component({
  selector: 'app-arknockoff',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule,
    AlertpopupComponent,
  ],
  templateUrl: './arknockoff.component.html',
  styleUrl: './arknockoff.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ARKnockoffService,
    }
  ]
})
export class ARKnockoffComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'Action',
    'SNo',
    'UTR_No',
    'Benificiary',
    'Total_Remitted_Amount',
    'Invoice_Number',
    'Amount',
    'TDS_Amount',
    'TDS_Percent'
  ];

  selectedCompanyId: number | null = null;
  searchText = '';
  showTable = false;
  isLoading = false;

  popupForm!: FormGroup;
  showPopup = false;
  isEditMode = false;
  showErrors = false;
  selectedRow: any = null;

  popupMessage = '';
  popupSubMessage = '';
  showPopupAlert = false;

  userdetail: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_TOKEN) private arkService: IARKnockoffRepository
  ) { }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = userdetail ? JSON.parse(this._decrypt.decrypt(userdetail)) : null;
    this.buildForm();
    this.onSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private buildForm(): void {
    this.popupForm = this.fb.group({
      UTR_No: ['', Validators.required],
      Benificiary: ['', Validators.required],
      Total_Remitted_Amount: ['', Validators.required],
      Invoice_Number: ['', Validators.required],
      Amount: ['', Validators.required],
      TDS_Amount: ['', Validators.required],
      TDS_Percent: ['', Validators.required]
    });
  }

  handleCompanyEvent(company: any): void {
    if (!company) return;
    this.selectedCompanyId = company.companyId;
  }

  onSearch(): void {

    this.showTable = true;
    this.isLoading = true;

    this.arkService.GetARInvoiceDetails()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          this.dataSource.data = res?.Data?.Table ?? [];
        },
        error: (err) => {
          console.error(err);
        }
      });

    this.isLoading = false;
    this.dataSource.data = [];
  }

  openAdd(): void {
    this.isEditMode = false;
    this.popupForm.reset();
    this.showErrors = false;
    this.showPopup = true;
  }

  editRow(row: any): void {
    this.isEditMode = true;
    this.selectedRow = row;
    this.popupForm.patchValue({
      UTR_No: row.UTR_No_keywords ?? '',
      Benificiary: row.Benificiary_keywords ?? '',
      Total_Remitted_Amount: row.Total_Remitted_Amount_keywords ?? '',
      Invoice_Number: row.Invoice_Number_keywords ?? '',
      Amount: row.Amount_keywords ?? '',
      TDS_Amount: row.TDS_Amount_keywords ?? '',
      TDS_Percent: row.TDS_Percent_keywords ?? ''
    });
    this.showErrors = false;
    this.showPopup = true;
  }

  deleteRow(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const payload = {
      UTR_No_keywords: '',
      Benificiary_keywords: '',
      Total_Remitted_Amount_keywords: '',
      Invoice_Number_keywords: '',
      Amount_keywords: '',
      TDS_Amount_keywords: '',
      TDS_Percent_keywords: '',
      id: Number(row?.id ?? 0),
      mode: 'DELETE',
      userId: Number(this.userdetail?.user_Id ?? 0)
    };

    this.isLoading = true;

    this.arkService.SaveIgnoreText(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          const msg =
            res?.Data[0]?.Error_Message ||
            res?.Data?.data?.Table0?.[0]?.Message
          alert(msg);
          this.onSearch();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  closePopup(): void {
    this.showPopup = false;
    this.showErrors = false;
  }

  saveKnockOff(): void {
    if (this.popupForm.invalid) {
      this.showErrors = true;
      this.popupForm.markAllAsTouched();
      return;
    }

    const f = this.popupForm.getRawValue();

    const payload = {
      UTR_No_keywords: f.UTR_No ?? '',
      Benificiary_keywords: f.Benificiary ?? '',
      Total_Remitted_Amount_keywords: f.Total_Remitted_Amount ?? '',
      Invoice_Number_keywords: f.Invoice_Number ?? '',
      Amount_keywords: f.Amount ?? '',
      TDS_Amount_keywords: f.TDS_Amount ?? '',
      TDS_Percent_keywords: f.TDS_Percent ?? '',
      id: this.isEditMode ? Number(this.selectedRow?.id ?? 0) : 0,
      mode: this.isEditMode ? 'edit' : 'ADD',
      userId: Number(this.userdetail?.user_Id ?? 0)
    };

    this.isLoading = true;

    this.arkService.SaveIgnoreText(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          const msg =
            res?.Data[0]?.Error_Message ||
            res?.Data?.data?.Table0?.[0]?.Message

          alert(msg);
          this.closePopup();
          this.onSearch();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  private showAlert(message: string, subMessage = ''): void {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopupAlert = true;
  }
}