import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverCodeComponent } from './recover-code.component';

describe('RecoverCodeComponent', () => {
  let component: RecoverCodeComponent;
  let fixture: ComponentFixture<RecoverCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
