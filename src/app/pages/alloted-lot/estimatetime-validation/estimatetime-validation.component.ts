import { Component, Inject,EventEmitter, OnInit, Output } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-estimatetime-validation',
  standalone: true,
  imports: [],
  templateUrl: './estimatetime-validation.component.html',
  styleUrl: './estimatetime-validation.component.css'
})
export class EstimatetimeValidationComponent implements OnInit {
  TotalSecond:any;
  @Output() unterstoods = new EventEmitter<boolean>();
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<EstimatetimeValidationComponent>
  ) {
    console.log(this.data);
  
  }
ngOnInit(): void {
  this.TotalSecond=this.data.TotalSecond
}
matsnackbarClose()
{
  this.unterstoods.emit(false);
  this.snackBarRef.dismiss();
}
Understood()
{
  this.unterstoods.emit(false);
  this.snackBarRef.dismiss();
}
}
