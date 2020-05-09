import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSignComponent } from './map-sign.component';

describe('MapSignComponent', () => {
  let component: MapSignComponent;
  let fixture: ComponentFixture<MapSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
