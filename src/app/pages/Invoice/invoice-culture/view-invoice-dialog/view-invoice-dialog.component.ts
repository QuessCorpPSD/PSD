import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view-invoice-dialog',
  imports: [MatIconModule,CommonModule,MatCardModule],
  templateUrl: './view-invoice-dialog.component.html',
  styleUrl: './view-invoice-dialog.component.css'
})
export class ViewInvoiceDialogComponent {
  public isLoading = false;
  constructor(
    private dialogRef: MatDialogRef<ViewInvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
  ){

  }

  onClose(){
    this.dialogRef.close();
  }
}
