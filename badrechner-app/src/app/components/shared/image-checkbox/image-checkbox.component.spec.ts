import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCheckboxComponent } from './image-checkbox.component';

describe('ImageCheckboxComponent', () => {
  let component: ImageCheckboxComponent;
  let fixture: ComponentFixture<ImageCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
