import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './product-dialog.component.html',
})
export class ProductDialogComponent {
  form: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
  ) {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      price: [this.data.price, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.form.value,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
