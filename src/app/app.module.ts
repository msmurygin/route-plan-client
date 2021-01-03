import { HttpClientModule} from '@angular/common/http'
import { ActiveUsersComponent } from './active-users/active-users.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrderTypeFilterComponent } from './order-type-filter/order-type-filter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule} from '@angular/material/select'
import { MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core';
import { DestinationComponent } from './destination/destination.component';
import { RestService } from './rest-service.service';
import { StatusFilterComponent } from './status-filter/status-filter.component';
import { DateFilterComponent } from './date-filter/date-filter.component';


@NgModule({
  declarations: [
    AppComponent,
    ActiveUsersComponent,
    OrderTypeFilterComponent,
    DestinationComponent,
    StatusFilterComponent,
    DateFilterComponent
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
    ReactiveFormsModule
  ],
  providers: [
    RestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
