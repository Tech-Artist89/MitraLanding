import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomConfiguratorComponent } from './bathroom-configurator.component';

describe('BathroomConfiguratorComponent', () => {
  let component: BathroomConfiguratorComponent;
  let fixture: ComponentFixture<BathroomConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BathroomConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
