import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTasinmazComponent } from './update-tasinmaz.component';

describe('UpdateTasinmazComponent', () => {
  let component: UpdateTasinmazComponent;
  let fixture: ComponentFixture<UpdateTasinmazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTasinmazComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTasinmazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
