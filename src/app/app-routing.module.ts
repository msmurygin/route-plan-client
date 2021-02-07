import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationURL } from 'src/environments/navigation';
import { AuthGuardService } from './auth-guard.service';
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
      { path:  NavigationURL.HOME.name,                 component: LoginComponent},
      { path:  NavigationURL.PLAN_ROUTE.name,           component: RoutePlanMonitorComponent, canActivate: [AuthGuardService] },
      { path:  NavigationURL.REPLENISHMENT.name,        component: ReplenishmentTaskComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.PROBLEMS.name,             component: ProblemListComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.ORDER_LIST.name,           component: OrderListComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.ORDER_DETAIL.name,         component: OrderDetailComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.SKU_BALANCE.name,          component: SkuBalanceComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.CLAIMS.name,               component: ClaimsComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.CLAIMS_DETAIL.name,        component: ClaimsDetailsComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.CLAIMS_DETAIL_BY_SKU.name, component: SkuClaimsDetailComponent, canActivate: [AuthGuardService]  },
      { path:  NavigationURL.REPLENISHMENT_PRIORITY.name, component: ReplenishmentPriorityComponent , canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
