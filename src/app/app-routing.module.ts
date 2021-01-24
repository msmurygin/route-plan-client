import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationURL } from 'src/environments/navigation';
import { ClaimsDetailsComponent } from './claims-details/claims-details.component';
import { ClaimsComponent } from './claims/claims.component';
import { LoginComponent } from './login/login.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { ReplenishmentPriorityComponent } from './replenishment-priority/replenishment-priority.component';
import { ReplenishmentTaskComponent } from './replenishment-task/replenishment-task.component';
import { RoutePlanMonitorComponent } from './route-plan-monitor/route-plan-monitor.component';
import { SkuBalanceComponent } from './sku-balance/sku-balance.component';
import { SkuClaimsDetailComponent } from './sku-claims-detail/sku-claims-detail.component';


const routes: Routes = [
      { path:  "login",                                 component: LoginComponent },
      { path:  NavigationURL.HOME.name,                 component: RoutePlanMonitorComponent },
      { path:  NavigationURL.REPLENISHMENT.name,        component: ReplenishmentTaskComponent },
      { path:  NavigationURL.PROBLEMS.name,             component: ProblemListComponent },
      { path:  NavigationURL.ORDER_LIST.name,           component: OrderListComponent },
      { path:  NavigationURL.ORDER_DETAIL.name,         component: OrderDetailComponent },
      { path:  NavigationURL.SKU_BALANCE.name,          component: SkuBalanceComponent },
      { path:  NavigationURL.CLAIMS.name,               component: ClaimsComponent },
      { path:  NavigationURL.CLAIMS_DETAIL.name,        component: ClaimsDetailsComponent },
      { path:  NavigationURL.CLAIMS_DETAIL_BY_SKU.name, component: SkuClaimsDetailComponent },
      { path:  NavigationURL.REPLENISHMENT_PRIORITY.name, component: ReplenishmentPriorityComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
