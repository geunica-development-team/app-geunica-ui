import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAcademicUserComponentComponent } from './modal-add-academic-user-component.component';

describe('ModalAddAcademicUserComponentComponent', () => {
  let component: ModalAddAcademicUserComponentComponent;
  let fixture: ComponentFixture<ModalAddAcademicUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddAcademicUserComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddAcademicUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
