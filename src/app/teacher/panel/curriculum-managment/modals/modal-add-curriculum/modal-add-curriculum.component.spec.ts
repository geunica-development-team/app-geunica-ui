import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddCurriculumComponent } from './modal-add-curriculum.component';

describe('ModalAddCurriculumComponent', () => {
  let component: ModalAddCurriculumComponent;
  let fixture: ComponentFixture<ModalAddCurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddCurriculumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
