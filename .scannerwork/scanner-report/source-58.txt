import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasinmazTableComponent } from './tasinmaz-table.component';

describe('TasinmazTableComponent', () => {
  let component: TasinmazTableComponent;
  let fixture: ComponentFixture<TasinmazTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasinmazTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasinmazTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
