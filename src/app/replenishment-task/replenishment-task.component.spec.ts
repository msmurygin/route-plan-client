import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplenishmentTaskComponent } from './replenishment-task.component';



describe('TestComponent', () => {
  let component: ReplenishmentTaskComponent;
  let fixture: ComponentFixture<ReplenishmentTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplenishmentTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplenishmentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
