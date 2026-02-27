import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { ILeaveMaster } from '../../../Repository/Inputaggregator/ILeavemaster';
import { LeavetypemasterService } from '../../../Service/inputaggregator/leavetypemaster.service';
import { finalize } from 'rxjs';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { error } from 'console';
export const Pay_TOKEN = new InjectionToken<ILeaveMaster>('Pay_TOKEN');

@Component({
  selector: 'app-leavetypemaster',
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './leavetypemaster.component.html',
  styleUrl: './leavetypemaster.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LeavetypemasterService,
    }
  ]
})
export class LeavetypemasterComponent {
  showreportPopup: boolean = false;
  attributeMappings: any;
  showAddPopup = false;
  isshowtable = false;
  leaveType: string = '';
  isActive: number = 1;
  userdetail: any;
  isEditMode: boolean = false;
  selectedId: number | null = null; // store id for update
  constructor(@Inject(Pay_TOKEN) private service: ILeaveMaster, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  openAddPopup() {
    this.showAddPopup = true;
    this.isEditMode = false;
    this.selectedId = null;
    this.leaveType = '';
    this.isActive = 1;
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }
  leaveTypes: any[] = [];
  isLoading = false;
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.handleSearch();
  }
  handleSearch(): void {
    this.isshowtable = true;
    this.isLoading = true;

    this.service.getLeavetypes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {

          const tableData = res?.Data?.data?.Table0;
          console.log(tableData);
          if (!tableData || tableData.length === 0) {
            alert("No records found");
            this.leaveTypes = [];
            return;
          }

          this.bindLeaveTypes(tableData);
        },
        error: (err) => {
          console.error(err);
          this.leaveTypes = [];
        }
      });
  }
  bindLeaveTypes(data: any[]): void {

    this.leaveTypes = data.map(item => ({
      leaveId: item.LEAVE_TYPE_ID,
      leaveName: item.LEAVE_TYPE_NAME,
      isActive: item.ISACTIVE
    }));

  }
  // bindLeaveTypes(data: any[]): void {

  //   this.leaveTypes = data.map(item => ({
  //     leaveId: item.LEAVE_ID,
  //     leaveName: item.LEAVE_NAME,
  //     isActive: item.ISACTIVE
  //   }));

  // }
  deleterow(item: any) {

    if (!confirm("Are you sure you want to delete this row?")) {
      return;
    }
    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "delete",
      parentDetail: {
        LEAVE_TYPE_ID: item.leaveId,
        LEAVE_TYPE_NAME: item.leaveName,
        ISACTIVE: item.isActive ? true : false
      }
    };

    console.log('Delete Payload:', payload);

    this.service.LeavemasterSave(payload).subscribe({
      next: (res: any) => {
        if (res?.Data?.statusCode === 200) {
          this.isLoading = false;
          const message =
            res?.Data?.data?.Table0?.[0]?.Error_Message ||
            'Deleted Successfully';

          alert(message);

          this.handleSearch(); // refresh table
        } else {
          this.isLoading = false;
          alert("Delete Failed due to internal server error");
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Error while Deleting');
      }
    });
  }
  saveLeaveType() {

    if (!this.leaveType || this.leaveType.trim() === '') {
      alert('Leave Type is required');
      return;
    }

    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Add",
      parentDetail: {
        LEAVE_TYPE_ID: 0,
        LEAVE_TYPE_NAME: this.leaveType,
        ISACTIVE: this.isActive ? true : false
      }
    };
    console.log('Saving Payload:', payload);

    this.service.LeavemasterSave(payload).subscribe({
      next: (res: any) => {
        if (res.Data.statusCode === 200) {
          this.isLoading = false;
          alert(res?.Data?.data?.Table0?.[0].Error_Message || 'Updated Successfully');
          this.closeAddPopup();
          this.handleSearch();
        } else {
          this.isLoading = false;
          alert("Save Failed due to internal server error");
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Error while saving');
      }
    });

  }

  trackByIndex(index: number, item: any) {
    return index;
  }

}
