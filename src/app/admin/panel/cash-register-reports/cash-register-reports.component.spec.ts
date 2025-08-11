import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterReportsComponent } from './cash-register-reports.component';

describe('CashRegisterReportsComponent', () => {
  let component: CashRegisterReportsComponent;
  let fixture: ComponentFixture<CashRegisterReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRegisterReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
