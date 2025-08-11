import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterDashboardComponent } from './cash-register-dashboard.component';

describe('CashRegisterDashboardComponent', () => {
  let component: CashRegisterDashboardComponent;
  let fixture: ComponentFixture<CashRegisterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRegisterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
