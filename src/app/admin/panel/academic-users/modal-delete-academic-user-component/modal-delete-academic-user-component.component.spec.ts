import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteAcademicUserComponentComponent } from './modal-delete-academic-user-component.component';

describe('ModalDeleteAcademicUserComponentComponent', () => {
  let component: ModalDeleteAcademicUserComponentComponent;
  let fixture: ComponentFixture<ModalDeleteAcademicUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteAcademicUserComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteAcademicUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
