import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatCardModule,MatIconModule,CompanyallComponent,CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  constructor(private dialogRef: MatDialogRef<AddComponent>){}
  onClose(){
this.dialogRef.close();
  }
  handleCompanyEvent(event):void
  {

  }
}
