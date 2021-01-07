import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { ReplenishmentTaskComponent } from './replenishment-task/replenishment-task.component';
import { RoutePlanMonitorComponent } from './route-plan-monitor/route-plan-monitor.component';


const routes: Routes = [
      { path: '', component: RoutePlanMonitorComponent },
      { path: 'replenishment', component: ReplenishmentTaskComponent },
      { path: 'problems', component: ProblemListComponent },
      { path: 'orderlist', component: OrderListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
