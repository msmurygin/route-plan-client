import { HttpClientModule} from '@angular/common/http'
import { ActiveUsersComponent } from './active-users/active-users.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule} from '@angular/material/select'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule} from '@angular/material/core';
import { RestService } from './rest-service.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDividerModule} from '@angular/material/divider';
import { MatTableModule} from '@angular/material/table';
import { RoutePlanMonitorComponent } from './route-plan-monitor/route-plan-monitor.component';
import { DateFormatPipe } from './date-format.pipe';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';
import { ReplenishmentTaskComponent } from './replenishment-task/replenishment-task.component';

import {MatToolbarModule} from '@angular/material/toolbar'
import {MatMenuModule} from '@angular/material/menu'
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { TableRowColorUtils } from './table-row-color-utils';
import { OrderListComponent } from './order-list/order-list.component';


@NgModule({
  declarations: [
    AppComponent,
    ActiveUsersComponent,
    RoutePlanMonitorComponent,
    ReplenishmentTaskComponent,
    ProblemListComponent,
    OrderListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule, 
    MatButtonModule,
    MatExpansionModule, 
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,

    TableModule,
    ButtonModule,
    ContextMenuModule,
    ToastModule,
    MatToolbarModule,
    MatMenuModule,
    BreadcrumbModule,
  ],
  providers: [
    RestService,
    DateFormatPipe,
    TableRowColorUtils,
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
