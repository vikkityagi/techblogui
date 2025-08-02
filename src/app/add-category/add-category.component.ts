import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { Logger } from 'src/logger/logger';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {

  successMessage: string = '';
  errorMessage: string = '';
  categoryForm: any = FormGroup;
  imageInvalid = false;
  private logger = Logger;
  constructor(private fb: FormBuilder, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.formInit();
  }


  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        this.imageInvalid = true;
        this.categoryForm.get('imageUrl')?.setErrors({ maxSize: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.categoryForm.get('imageUrl')?.setValue(base64String);
        this.imageInvalid = false;
      };
      reader.readAsDataURL(file);
    } else {
      this.categoryForm.get('imageUrl')?.setValue('');
      this.imageInvalid = true;
    }
  }








  private formInit() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });

  }

  onSubmit() {
    if (this.categoryForm.valid) {

      this.categoryService.addCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.successMessage = '';
            this.resetForm();
          }, 3000);
          this.successMessage = 'Category added successfully!';
          this.errorMessage = '';
          this.logger.log('Category added:', response);

        }, error: (error) => {
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
          this.successMessage = '';
          this.errorMessage = 'Error adding category. Please try again.';
          this.logger.error('Error adding category:', error);
        }
      });


    } else {
      this.errorMessage = 'Please fill all required fields.';
      console.error('Form is invalid:', this.categoryForm.errors);
      this.successMessage = '';
      this.imageInvalid = true;
    }
  }
  resetForm() {
    this.categoryForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.imageInvalid = false;
  }


}
