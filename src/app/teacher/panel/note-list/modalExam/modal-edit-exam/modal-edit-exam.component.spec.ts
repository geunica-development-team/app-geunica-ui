import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditExamComponent } from './modal-edit-exam.component';

describe('ModalEditExamComponent', () => {
  let component: ModalEditExamComponent;
  let fixture: ComponentFixture<ModalEditExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
