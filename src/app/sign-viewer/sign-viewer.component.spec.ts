import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignViewerComponent } from './sign-viewer.component';

describe('SignViewerComponent', () => {
  let component: SignViewerComponent;
  let fixture: ComponentFixture<SignViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
