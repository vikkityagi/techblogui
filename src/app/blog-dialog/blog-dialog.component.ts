import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-blog-dialog',
  templateUrl: './blog-dialog.component.html',
  styleUrls: ['./blog-dialog.component.scss']
})
export class BlogDialogComponent {

   constructor(
    public dialogRef: MatDialogRef<BlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public blog: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

}
