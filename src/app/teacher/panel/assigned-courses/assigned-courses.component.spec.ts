import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCoursesComponent } from './assigned-courses.component';

describe('AssignedCoursesComponent', () => {
  let component: AssignedCoursesComponent;
  let fixture: ComponentFixture<AssignedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
