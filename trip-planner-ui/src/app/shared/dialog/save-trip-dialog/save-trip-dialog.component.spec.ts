import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTripDialogComponent } from './save-trip-dialog.component';

describe('SaveTripDialogComponent', () => {
  let component: SaveTripDialogComponent;
  let fixture: ComponentFixture<SaveTripDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveTripDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveTripDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
