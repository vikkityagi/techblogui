import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerBankDialogComponent } from './scanner-bank-dialog.component';

describe('ScannerBankDialogComponent', () => {
  let component: ScannerBankDialogComponent;
  let fixture: ComponentFixture<ScannerBankDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScannerBankDialogComponent]
    });
    fixture = TestBed.createComponent(ScannerBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
