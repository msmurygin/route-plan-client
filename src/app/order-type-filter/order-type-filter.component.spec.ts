import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTypeFilterComponent } from './order-type-filter.component';

describe('OrderTypeFilterComponent', () => {
  let component: OrderTypeFilterComponent;
  let fixture: ComponentFixture<OrderTypeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTypeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
