import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTripDialogComponent } from './delete-trip-dialog.component';

describe('DeleteTripDialogComponent', () => {
  let component: DeleteTripDialogComponent;
  let fixture: ComponentFixture<DeleteTripDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTripDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTripDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
