import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeletCurriculumComponent } from './modal-delet-curriculum.component';

describe('ModalDeletCurriculumComponent', () => {
  let component: ModalDeletCurriculumComponent;
  let fixture: ComponentFixture<ModalDeletCurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeletCurriculumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeletCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
