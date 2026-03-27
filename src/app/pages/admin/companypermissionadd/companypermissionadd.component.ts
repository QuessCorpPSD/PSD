import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-companypermissionadd',
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
    MatCheckboxModule
  ],
  templateUrl: './companypermissionadd.component.html',
  styleUrl: './companypermissionadd.component.css'
})
export class CompanypermissionaddComponent {

  addMenuForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<CompanypermissionaddComponent>) { }


  ngOnInit() {
    this.addMenuForm = new FormGroup({
      DisplayText: new FormControl("", Validators.required),
      Controller: new FormControl(""),
      ActioMethod: new FormControl(""),
      Area: new FormControl(""),
      DisplayIcon: new FormControl(""),
      ParentId: new FormControl(""),
      IsActive: new FormControl(false)
    })
  }

  Save() {

    if (this.addMenuForm.invalid) {

      // Highlight all fields (makes touched = true)
      this.addMenuForm.markAllAsTouched();

      return;
    }

    // If valid, proceed with save logic
    console.log("Form submitted", this.addMenuForm.value);
  }

  onClose() {
    this.dialogRef.close();
  }

}
