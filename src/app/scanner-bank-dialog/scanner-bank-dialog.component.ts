import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-scanner-bank-dialog',
  templateUrl: './scanner-bank-dialog.component.html',
  styleUrls: ['./scanner-bank-dialog.component.scss']
})
export class ScannerBankDialogComponent {
  countdown = 10;
  intervalId: any;
  details: any;
  interval: any;

  constructor(
    public dialogRef: MatDialogRef<ScannerBankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private paymentService: PaymentService
  ) {
    this.startCountdown();
  }



  ngOnInit() {
    this.paymentService.getPaymentDetails().subscribe(data => {
      this.details = data;
      this.startStatusCheck(data.txnId);
    });
  }

  startStatusCheck(txnId: string) {
    this.interval = setInterval(() => {
      this.paymentService.getTransactionStatus(txnId).subscribe(status => {
        if (status.status !== 'PENDING') {
          clearInterval(this.interval);
          alert(`Transaction ${status.status}`);
        }
      });
    }, 5000); // check every 5 sec
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
