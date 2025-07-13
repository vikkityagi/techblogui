import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-scanner-bank-dialog',
  templateUrl: './scanner-bank-dialog.component.html',
  styleUrls: ['./scanner-bank-dialog.component.scss']
})
export class ScannerBankDialogComponent {
  countdown = 10;
  intervalId: any;

  constructor(
    public dialogRef: MatDialogRef<ScannerBankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startCountdown();
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.close();
      }
    }, 1000);
  }

  extendTime() {
    this.countdown += 10;
  }

  doNotShowAgain() {
  localStorage.setItem('paymentDone', 'true');
  this.close();
}

  close(): void {
    clearInterval(this.intervalId);
    this.dialogRef.close();
  }
}
