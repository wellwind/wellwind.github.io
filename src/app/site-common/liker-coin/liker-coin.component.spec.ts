import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikerCoinComponent } from './liker-coin.component';

describe('LikerCoinComponent', () => {
  let component: LikerCoinComponent;
  let fixture: ComponentFixture<LikerCoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LikerCoinComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikerCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
