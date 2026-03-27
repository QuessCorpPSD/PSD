import { CommonModule } from '@angular/common';
import { Component, Optional} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreakComponent } from '../../../pages/employee/break/break.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-breakdetails',
    imports: [CommonModule, MatCardModule, MatIconModule, BreakComponent],
    templateUrl: './breakdetails.component.html',
    styleUrl: './breakdetails.component.css'
})
export class BreakdetailsComponent {
  constructor(@Optional()  private dialogRef: MatDialogRef<BreakdetailsComponent>){}

  close()
  {
    this.dialogRef.close();
  }
}