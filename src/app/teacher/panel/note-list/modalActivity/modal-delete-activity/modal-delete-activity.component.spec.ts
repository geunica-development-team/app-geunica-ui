import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteActivityComponent } from './modal-delete-activity.component';

describe('ModalDeleteActivityComponent', () => {
  let component: ModalDeleteActivityComponent;
  let fixture: ComponentFixture<ModalDeleteActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
