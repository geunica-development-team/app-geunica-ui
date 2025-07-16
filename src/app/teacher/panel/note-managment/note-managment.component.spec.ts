import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteManagmentComponent } from './note-managment.component';

describe('NoteManagmentComponent', () => {
  let component: NoteManagmentComponent;
  let fixture: ComponentFixture<NoteManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
