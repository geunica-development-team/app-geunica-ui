import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesRegistryComponent } from './grades-registry.component';

describe('GradesRegistryComponent', () => {
  let component: GradesRegistryComponent;
  let fixture: ComponentFixture<GradesRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesRegistryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradesRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
