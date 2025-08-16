import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditActivityComponent } from './modal-edit-activity.component';

describe('ModalEditActivityComponent', () => {
  let component: ModalEditActivityComponent;
  let fixture: ComponentFixture<ModalEditActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
