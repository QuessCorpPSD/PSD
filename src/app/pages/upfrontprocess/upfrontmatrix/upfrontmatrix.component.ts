import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { IUpfrontMatrix } from '../../../Repository/upfrontprocess/Iupfrontmatrix';
import { UpfrontmatrixService } from '../../../Service/upfrontprocess/upfrontmatrix.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCheckboxModule } from '@angular/material/checkbox';
export const Pay_TOKEN = new InjectionToken<IUpfrontMatrix>('Pay_TOKEN');

@Component({
  selector: 'app-upfrontmatrix',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginator, MatTableModule, MatTooltipModule, MatCheckboxModule],
  templateUrl: './upfrontmatrix.component.html',
  styleUrl: './upfrontmatrix.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: UpfrontmatrixService,
    }
  ]
})
export class UpfrontmatrixComponent {
  isAddclicked = false;
  isEditMode = false;
  isUploadGridVisible = false;
  roletype: any;
  isLoading = false;
  upfrontmatrix!: FormGroup;
  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  data: any[] = [];
  displayedColumns: string[] = [
    'delete',
    'Userid',
    'Username',
    'Min_approve_limit',
    'Max_approve_limit',
    'Zone',
    'roletype',
    'Isactive',
    'Mail_id'

  ];
  dataSource = new MatTableDataSource<any>([]);
  role: any;
  addrole: any;
  userlist: any;
  subuserlist: any;
  Zone: any;
  userdetail: any;
  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IUpfrontMatrix, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.upfrontmatrix = this.fb.group({
      roleType: ['', Validators.required],
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      mailId: ['', [Validators.required, Validators.email]],
      subuserId: [''],
      subuserName: [''],
      submailId: [''],
      mod: ['', Validators.required],
      designation: ['', Validators.required],
      minApproveLimit: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      enableMaxApproveLimit: [false],
      maxApproveLimit: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]],
      isactive: [''],
      zone: ['', Validators.required]
    });
    this.upfrontmatrix.get('roleType')?.valueChanges.subscribe(value => {
      console.log('roleType selected:', value);
      if (value == 1) {
        this.disableApprovalFields();
      } else {
        this.enableApprovalFields();
      }
    });
    this.upfrontmatrix.get('userName')?.disable();
    this.upfrontmatrix.get('mailId')?.disable();
    this.upfrontmatrix.get('subuserName')?.disable();
    this.upfrontmatrix.get('submailId')?.disable();
    const maxCtrl = this.upfrontmatrix.get('maxApproveLimit');
    const enableCtrl = this.upfrontmatrix.get('enableMaxApproveLimit');

    // initial state
    if (enableCtrl?.value === true) {
      maxCtrl?.reset();
      maxCtrl?.disable();
    } else {
      maxCtrl?.reset();
      maxCtrl?.enable();
    }

    // listen to checkbox changes
    enableCtrl?.valueChanges.subscribe((checked: boolean) => {
      maxCtrl?.reset(); // 👈 clears value every time

      if (checked) {
        maxCtrl?.disable();
      } else {
        maxCtrl?.enable();
      }
    });


    console.log('checked', this.upfrontmatrix.get('enableMaxApproveLimit')?.value)

    this.upfrontmatrix.get('userId')?.valueChanges.subscribe(userId => {

      if (!userId) {
        this.upfrontmatrix.patchValue({
          userName: '',
          mailId: ''
        });
        return;
      }

      const selectedUser = this.userlist.find(
        (u: any) => u.UserId === userId
      );

      if (selectedUser) {
        this.upfrontmatrix.patchValue({
          userName: selectedUser.UserName,
          mailId: selectedUser.EmailId
        });
      }
    });
    this.upfrontmatrix.get('subuserId')?.valueChanges.subscribe(subuserId => {

      if (!subuserId) {
        this.upfrontmatrix.patchValue({
          subuserName: '',
          submailId: ''
        });
        return;
      }

      const selectedUser = this.subuserlist.find(
        (u: any) => u.UserId === subuserId
      );

      if (selectedUser) {
        this.upfrontmatrix.patchValue({
          subuserName: selectedUser.UserName,
          submailId: selectedUser.EmailId
        });
      }
    });


    this.BindRoletype();
    // this.BindAddroletype();
    this.BindAddusertype();
    this.BindAddsubusertype();
    this.BindZone();
  }

  disableApprovalFields() {
    const fields = [
      'designation',
      'minApproveLimit',
      'enableMaxApproveLimit',
      'maxApproveLimit'
    ];

    fields.forEach(field => {
      const control = this.upfrontmatrix.get(field);
      control?.disable();
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }
  enableApprovalFields() {
    this.upfrontmatrix.get('designation')?.enable();
    this.upfrontmatrix.get('designation')?.setValidators(Validators.required);

    this.upfrontmatrix.get('minApproveLimit')?.enable();
    this.upfrontmatrix.get('minApproveLimit')?.setValidators([
      Validators.required,
      Validators.pattern(/^[0-9]+$/)
    ]);

    this.upfrontmatrix.get('enableMaxApproveLimit')?.enable();

    this.upfrontmatrix.get('maxApproveLimit')?.enable();
    this.upfrontmatrix.get('maxApproveLimit')?.setValidators([
      Validators.required,
      Validators.pattern(/^[0-9]+$/)
    ]);

    [
      'designation',
      'minApproveLimit',
      'maxApproveLimit'
    ].forEach(field => {
      this.upfrontmatrix.get(field)?.updateValueAndValidity();
    });
  }
  BindRoletype() {
    this.service.GetRole().subscribe({
      next: res => {
        this.role = res.data.data.Table0;
        this.addrole = res.data.data.Table0;
      }
    });
  }
  BindZone() {
    this.service.GetZone().subscribe({
      next: res => {
        this.Zone = res.data.data.Table0;
      }
    });
  }
  // BindAddroletype() {
  //   this.service.GetRole().subscribe({
  //     next: res => {
  //       this.addrole = res.data.data.Table0;
  //     }
  //   });
  // }
  BindAddusertype() {
    const userid = 0;
    const suserid = 0;
    this.service.GetUserlist(userid, suserid).subscribe({
      next: res => {
        this.userlist = res.data.data.Table0;
      }
    });
  }
  BindAddsubusertype() {
    const userid = 0;
    const suserid = 0;
    this.service.GetUserlist(userid, suserid).subscribe({
      next: res => {
        this.subuserlist = res.data.data.Table0;
      }
    });
  }
  allowOnlyNumbers(event: any) {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');

    this.upfrontmatrix.get('minApproveLimit')?.setValue(input.value);

  }

  allowOnlyNumbersmax(event: any) {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');

    this.upfrontmatrix.get('maxApproveLimit')?.setValue(input.value);

  }

  closeclick() {
    this.isAddclicked = false;
  }
  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;

    this.upfrontmatrix.reset();
    // enableMaxApproveLimit: true
    this.upfrontmatrix.get('enableMaxApproveLimit')?.setValue(false);

    this.upfrontmatrix.get('maxApproveLimit')?.disable();

  }
  EditOpen(element: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.isLoading = true;
    // patch form values
    this.upfrontmatrix.patchValue({

      roleType: element.RoleType,
      userId: element.Userid,
      userName: element.UserNmae,
      mailId: element.MailID,
      minApproveLimit: element.ApproveLimitFrom ?? '',
      maxApproveLimit: element.MaxApproveLimit ?? '',
      isactive: element.IsActive,
      zone: element.Zone,
      subuserId: element.SubUserId ?? '',
      subuserName: element.SubUserName ?? '',
      submailId: element.SubMailID ?? '',
      mod: element.Mod ?? '',
      designation: element.Designation ?? ''
    });
    this.isLoading = false;
    const isLimitDisabled =
      element.isLimit === true ||
      element.MaxApproveLimit == null ||
      element.MaxApproveLimit === 0;

    this.upfrontmatrix.patchValue({
      enableMaxApproveLimit: isLimitDisabled
    });

    if (isLimitDisabled) {
      this.upfrontmatrix.get('maxApproveLimit')?.disable();
      this.upfrontmatrix.get('maxApproveLimit')?.setValue('');
    } else {
      this.upfrontmatrix.get('maxApproveLimit')?.enable();
      this.upfrontmatrix.get('maxApproveLimit')?.setValue(element.MaxApproveLimit);
    }

  }


  onsearch() {
    if (!this.roletype) {
      alert('Please Select Role Type');
      return;
    }
    this.isLoading = true;
    this.isUploadGridVisible = true;

    const roletype = this.roletype;
    console.log(roletype)

    this.service.Search(roletype).subscribe({
      next: (res) => {
        this.dataSource.data = [];


        if (res.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.isLoading = false;
          return;
        }
        this.data = res.data.data.Table0;
        console.log('data', this.data);

        if (this.data && this.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          alert('No data found for the selected criteria');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.isLoading = false;
        alert('Failed to load data');
      }
    });
  }
  markFormTouched() {
    this.upfrontmatrix.markAllAsTouched();
    // this.rows.controls.forEach(row => row.markAllAsTouched());
  }
  saveUpfrontMatrix() {
    if (this.upfrontmatrix.invalid) {
      this.markFormTouched();
      return;
    }
    this.isLoading = true;
    const formValues = this.upfrontmatrix.getRawValue();
    const payload = {
      userid: formValues.userId,
      userName: formValues.userName,
      minLimit: formValues.minApproveLimit || '0',
      maxLimit: formValues.maxApproveLimit || '0',
      isActive: formValues.isactive ? true : false,
      mailID: formValues.mailId,
      createdBy: this.userdetail.user_Id.toString(),
      flag: this.isEditMode ? '2' : '1',
      roleType: formValues.roleType.toString(),
      zone: formValues.zone,
      upmailID: '',
      designation: formValues.designation || '',
      modeOfPayment: formValues.mod,
      subUserid: formValues.subuserId || '',
      subUserName: formValues.subuserName || '',
      subMailID: formValues.submailId || '',
      isLimit: formValues.enableMaxApproveLimit ? "1" : "0"
    };

    console.log('Payload to send:', payload);
    console.log('Payload to send:', JSON.stringify(payload));


    this.service.save(payload).subscribe({
      next: (res: any) => {

        const message =
          (res?.data[0]?.result || res?.data?.message || '').toString().toLowerCase();

        if (message.includes('success')) {
          alert(res?.data[0]?.result)
          this.closeclick();
        } else {
          console.warn('Save failed', res);
          alert(res?.data[0]?.result);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Save error', err);
        this.isLoading = false;
        alert('Something went wrong while saving');
      }
    });

  }
  deleteRow(row: any) {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }
    this.isLoading = true;
    const payload = {
      userid: row.Userid,
      userName: '',

      minLimit: '0',
      maxLimit: '0',

      isActive: row.IsActive ? true : false,
      mailID: '',

      createdBy: this.userdetail.user_Id.toString(), // REQUIRED
      flag: '3',                          // DELETE FLAG

      roleType: '',
      zone: '',
      upmailID: '',
      designation: '',
      modeOfPayment: '',

      subUserid: '',
      subUserName: '',
      subMailID: '',

      isLimit: '0'
    };

    console.log('Delete payload:', payload);
    console.log('Delete payload:', JSON.stringify(payload));


    this.service.save(payload).subscribe({
      next: (res: any) => {
        const message =
          (res?.data[0]?.result || res?.data?.message || '')
            .toString()
            .toLowerCase();

        if (message.includes('success')) {
          alert(res?.data[0]?.result);
        } else {
          alert(res?.data[0]?.result || 'Delete failed');
        }
        this.isLoading = false;
      },
      error: () => {
        alert('Something went wrong while deleting');
        this.isLoading = false;
      }
    });
  }

}


