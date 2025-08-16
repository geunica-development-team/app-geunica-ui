import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteExamComponent } from './modal-delete-exam.component';

describe('ModalDeleteExamComponent', () => {
  let component: ModalDeleteExamComponent;
  let fixture: ComponentFixture<ModalDeleteExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
