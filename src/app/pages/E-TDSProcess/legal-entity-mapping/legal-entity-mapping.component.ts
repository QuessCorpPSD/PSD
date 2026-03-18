import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-legal-entity-mapping',
  imports: [CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    MatRadioModule],
  templateUrl: './legal-entity-mapping.component.html',
  styleUrl: './legal-entity-mapping.component.css'
})
export class LegalEntityMappingComponent {
  selectedCompanyId!: number;
  payPeriodType!: string;
  selectedCompanyCode: any;
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  isAddclicked = false;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  legalentityform!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'LegalEntityCode',
    'LegalEntityName',
    'Entity',
    'EffectiveDate'
  ];
  constructor(private dialog: MatDialog, private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private fb: FormBuilder) { }


  dataSource = new MatTableDataSource<any>([]);
  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    const userInfo = {    
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };
    this.legalentityform = new FormGroup({
      Legal_Entity: new FormControl(['']),
      Entity: new FormControl(['']),
      EffectiveDate: new FormControl([''])
    })
  }

  onSearchClick() {
    this.showTable = true;
    this.dataSource.data = this.uploadedData;

  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr.replace(/-/g, '/').replace('T', ' '));
    return date.toISOString().split('T')[0];
  }
  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
  }

  closeclick() {
    this.isAddclicked = false;
  }

}


