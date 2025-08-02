import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditAcademicUserComponentComponent } from './modal-edit-academic-user-component.component';

describe('ModalEditAcademicUserComponentComponent', () => {
  let component: ModalEditAcademicUserComponentComponent;
  let fixture: ComponentFixture<ModalEditAcademicUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditAcademicUserComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditAcademicUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
