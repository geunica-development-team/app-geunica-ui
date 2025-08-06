import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditCurriculumComponent } from './modal-edit-curriculum.component';

describe('ModalEditCurriculumComponent', () => {
  let component: ModalEditCurriculumComponent;
  let fixture: ComponentFixture<ModalEditCurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditCurriculumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
