import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScannerBankDialogComponent } from './scanner-bank-dialog/scanner-bank-dialog.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'techyatrawithvikki';
  currentYear: number = new Date().getFullYear();
  @ViewChild('drawer') drawer!: MatSidenav; // ✅ fix

  toggleDrawer() {
    this.drawer.toggle(); // 👈 called from navbar event
  }

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialog.open(ScannerBankDialogComponent, {
      width: '600px',
      disableClose: false // allow manual closing
    });
  }

  openPaymentDialog(): void {
    // If you want to reset “don’t show again” each manual open:
    // localStorage.removeItem('paymentDone');
    this.dialog.open(ScannerBankDialogComponent, {
      width: '400px',
      disableClose: false
    });
  }
}
