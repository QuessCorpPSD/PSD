import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupnameComponent } from '../../groupname/groupname.component';
import { MatSort } from '@angular/material/sort';
import { finalize } from 'rxjs';
import { ISkilltypeMapping } from '../../../Repository/customer/Iskillmappingrepository';
import { SkillmappingService } from '../../../Service/CUSTOMER/skillmapping.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyconstructionComponent } from "../../../common/companyconstruction/companyconstruction.component";
import { DesignationComponent } from '../../../common/Designation/designation.component';
import { MaterialCodeComponent } from '../../../common/MaterialCode/materialcode.component';
import { BillingtypeComponent } from '../../../common/billingtype/billingtype.component';
const Pay_TOKEN = new InjectionToken<ISkilltypeMapping>('Pay_TOKEN');
@Component({
  selector: 'app-skill-category-construction',
  imports: [MatIcon, MatTooltipModule, MatPaginator, MatTableModule, CommonModule, MatCardModule, ReactiveFormsModule, GroupnameComponent, CompanyconstructionComponent, DesignationComponent, MaterialCodeComponent, BillingtypeComponent],
  templateUrl: './skill-category-construction.component.html',
  styleUrl: './skill-category-construction.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: SkillmappingService,
    }
  ]
})
export class SkillCategoryConstructionComponent {
  selectedCompanyId: any;
  dataSource = new MatTableDataSource<any>();
  uploadDisplayedColumns = ['Action', 'SNo', 'Company_code', 'SiteName', 'PO_Number', 'SkillType', 'MaterialCodeName', 'DesignationName', 'BillingTypeName', 'OTRate', 'Amount', 'EffectiveDate'];
  showTable = false;
  skillCategoryForm!: FormGroup;
  showSkillPopup = false;
  isEditMode = false;
  isDeleteMode = false;
  showErrors = false;
  selectedCompanyIdadd: any;
  selectedGroupId: any;
  selectedGroupName: any;
  isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  table: any;
  selectedGroupIdmain: any;
  selectedGroupNamemain: any;
  exportdata: any;
  userdetail: any;
  selectedcompanycode: any;
  selectedId: number = 0;
  SelectedSkillId: number = 0;
  ponumber: any;
  selectedDesignation?:any;
  selectedDesignationId?: number;
  selectedDesignationName: string = '';
  selectedMaterialCode?:any;
  selectedMaterialCodeId?: number;
  selectedMaterialCodeName: string = '';
  selectedBillingtype?:any;
  selectedBillingTypeId?: number;
  selectedBillingTypeName: string = '';

  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: ISkilltypeMapping, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.skillCategoryForm = this.fb.group({
      Company_code: ['', Validators.required],
      SiteName: ['', Validators.required],
      PO_Number: ['', Validators.required],
      SkillType: ['', Validators.required],
      MaterialCode: ['', Validators.required],
      Designation: ['', Validators.required],
      BillingType: ['', Validators.required],
      OTRate: [0, Validators.required],
      Amount: [0, Validators.required],
      EffectiveDate: ['', Validators.required],

    });

  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }
  handleCompanyEventadd(company) {
    this.selectedCompanyIdadd = company.companyId;
    this.selectedcompanycode = company.companyCode;
    this.BindPonumber();

  }
  handleGroupEvent(group: any) {
    this.selectedGroupId = group.siteCode;
    this.selectedGroupName = group.siteName;
    this.skillCategoryForm.patchValue({
      SiteName: group.siteName
    });
  }
  handleGroupEventmain(group: any) {
    this.selectedGroupIdmain = group.siteCode;
    this.selectedGroupNamemain = group.siteName;
  }

  handleMaterialCodeEvent(materialCode: any) {
    //console.log('Selected Material Code:', materialCode);
    this.selectedMaterialCodeId = materialCode.ID;
    this.selectedMaterialCodeName = materialCode.Code;
    this.skillCategoryForm.patchValue({
      MaterialCode: materialCode
    });
  }


  handleDesignationEvent(designation: any) {
    this.selectedDesignationId = designation.designation_Id;
    this.selectedDesignationName = designation.designation_Name;
    //this.Designation = designation;
    this.skillCategoryForm.patchValue({
      Designation: designation
    });
  }

  handleBillingTypeEvent(billingType: any) {
    //console.log('Selected Billing Type:', billingType);
    this.selectedBillingTypeId = billingType.rowid;
    this.selectedBillingTypeName = billingType.code;
    this.skillCategoryForm.patchValue({
      BillingType: billingType
    });
  }

  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please select company');
      return;
    }

    if (!this.selectedGroupIdmain) {
      alert('Please select sitename');
      return;
    }

    this.isLoading = true;
    this.showTable = true;
    this.dataSource = new MatTableDataSource<any>([]);
    this.table = [];

    const companyId = this.selectedCompanyId;
    const groupId = this.selectedGroupIdmain;

    this.service.search(companyId, groupId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({

        next: (res) => {

          if (res?.Data?.statusCode === "400") {
            this.table = [];
            this.dataSource.data = [];

            alert(res.Data.message);
            return;
          }
          this.table = res.Data.data.Table0 || res.Data;

          this.dataSource = new MatTableDataSource(this.table);

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          if (this.sort) {
            this.dataSource.sort = this.sort;
          }

          if (this.table.length === 0) {
            alert('No data found');
          }

        },

        error: (err) => {
          console.error('Search error:', err);
        }
      });
  }


  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please select company');
      return;
    }

    if (!this.selectedGroupIdmain) {
      alert('Please select sitename');
      return;
    }

    this.isLoading = true;

    const companyId = this.selectedCompanyId;
    const groupId = this.selectedGroupIdmain;

    this.service.search(companyId, groupId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data.data.Table0;
          this.exportdata = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            alert(this.exportdata);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "Skilltype");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `SkilltypeMapping_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          console.error('Error exporting to Excel:', err);
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }
  openadd() {
    this.showSkillPopup = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.skillCategoryForm.reset();
    this.skillCategoryForm.get('PO_Number')?.setValue(null);
    this.showErrors = false;
    this.ponumber = [];
  }
  formatDate(value: string): string {

    if (!value) return '';

    return value.split(' ')[0];
  }
  BindPonumber() {
    const companyid = this.selectedCompanyIdadd;
    this.service.getponumber(companyid).subscribe({
      next: res => {
        this.ponumber = res.Data;
        this.skillCategoryForm.get('PO_Number')?.setValue(null);
      }
    });
  }

//   writeValue(value: any): void {
//   if (value) {
//     this.selectedBillingtype = value;
//   } else {
//     this.selectedBillingtype = null;
//   }
// }
  editSkillCategory(row: any) {

    this.showSkillPopup = true;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.selectedId = row.Serial_No;
    this.SelectedSkillId = row.Manual_Invoice_Id;

    this.selectedCompanyIdadd = row.Company_Id;
    this.selectedcompanycode = row.Company_code;

    this.selectedGroupId = row.SiteId;
    this.selectedGroupName = row.SiteName;
    const patchDesignation = { designation_Id: row.DesignationId, designation_Name: row.DesignationName }
    const patchMaterialCode = { ID: row.MaterialCodeId, Code: row.MaterialCodeName , Description: row.MaterialCodeName}
    const patchBillingType = { rowid: row.BillingTypeId, code: row.BillingTypeName }

    const parts = row.EffectiveDate.split(' ')[0].split('-');

    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    this.skillCategoryForm.patchValue({
      Company_code: row.Company_code,
      SiteName: row.SiteName,
      SkillType: row.SkillType,
      Designation: patchDesignation,
      MaterialCode: patchMaterialCode,
      BillingType: patchBillingType,
      OTRate: row.OTRate,
      Amount: row.Amount,
      EffectiveDate: formattedDate,
    });
    this.service.getponumber(this.selectedCompanyIdadd).subscribe({
      next: res => {
        this.ponumber = res.Data || [];

        // Now bind PO_Number AFTER options are loaded
        this.skillCategoryForm.patchValue({
          PO_Number: row.PO_Number
        });

      }
    });

  }
  saveSkillCategory() {

    this.showErrors = true;

    if (this.skillCategoryForm.invalid) {
      return;
    }

    this.isLoading = true;
    const payload = {
      Manual_Invoice_Id: this.isDeleteMode
        ? this.SelectedSkillId
        : this.isEditMode
          ? this.SelectedSkillId
          : 0,
      Company_Id: this.selectedCompanyIdadd,
      Company_code: this.selectedcompanycode,

      SiteId: this.selectedGroupId,
      SiteName: this.selectedGroupName,
      SkillType: this.skillCategoryForm.value.SkillType,
      Amount: this.skillCategoryForm.value.Amount,
      EffectiveDate: this.skillCategoryForm.value.EffectiveDate,
      PO_Number: this.skillCategoryForm.value.PO_Number,
      DesignationId: this.selectedDesignationId,
      DesignationName: this.selectedDesignationName,
      MaterialCodeId: this.selectedMaterialCodeId,
      MaterialCodeName: this.selectedMaterialCodeName.toString(),
      BillingTypeId: this.selectedBillingTypeId,
      BillingTypeName: this.selectedBillingTypeName,
      OTRate: this.skillCategoryForm.value.OTRate,
      Action: this.isDeleteMode
        ? 'Delete'
        : this.isEditMode
          ? 'Edit'
          : 'add',
      UserId: this.userdetail.user_Id
    };
    this.service.createUpdateSkillMapping(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        const message = res.Data[0][""];

        alert(message);

        this.closePopup();
        if (this.selectedCompanyId && this.selectedGroupIdmain) {
          this.onsearch();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  closePopup() {
    this.showSkillPopup = false;
    this.selectedCompanyId.clear();
    this.selectedCompanyIdadd.clear();
    this.selectedGroupId.clear();
    this.selectedGroupName.clear();
    this.selectedDesignationId = undefined;
    this.selectedDesignationName = '';
    this.selectedMaterialCodeId = undefined;
    this.selectedMaterialCodeName = '';
    this.selectedBillingTypeId = undefined;
    this.selectedBillingTypeName = '';
    this.skillCategoryForm.reset({
      IsActive: true
    });
  }
  deleteSkillCategory(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.isDeleteMode = true;
    this.isEditMode = false;
    this.SelectedSkillId = row.Manual_Invoice_Id;

    const payload = {
      Manual_Invoice_Id: this.isDeleteMode
        ? this.SelectedSkillId
        : this.isEditMode
          ? this.SelectedSkillId
          : 0,
      Action: this.isDeleteMode
        ? 'Delete'
        : this.isEditMode
          ? 'Edit'
          : 'add',
      UserId: this.userdetail.user_Id
    };

    this.isLoading = true;
    this.service.createUpdateSkillMapping(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        const message = res.Data[0][""];

        alert(message);

        this.closePopup();
        if (this.selectedCompanyId && this.selectedGroupIdmain) {
          this.onsearch();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
