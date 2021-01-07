import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerURL } from 'src/environments/controllers';
import { RestService } from '../rest-service.service';
import Codelkup from '../dto/codelkup';
import { DateFormatPipe } from '../date-format.pipe';
import { MenuItem, MessageService } from 'primeng/api';
import { PlanRouteDetailTable } from '../dto/plan-route-detail-table';
import { PlanRouteHeaderTable } from '../dto/plan-route-header-table';
import { RequestBody } from '../dto/plan-route-request-body';
import { ReplenishmentTaskRequestBody } from '../dto/replenishment-task-request-body';
import { Router } from '@angular/router';
import { TableRowColorUtils } from '../table-row-color-utils';



@Component({
  selector: 'route-plan-monitor',
  templateUrl: './route-plan-monitor.component.html',
  styleUrls: ['./route-plan-monitor.component.css'],
  providers:[MessageService],
  styles: [`
  :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: 0px;
  }

  @media screen and (max-width: 64em) {
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
          top: 99px;
      }
  }

`]
})
export class RoutePlanMonitorComponent implements OnInit  {

  /****  Фильтры ***/
  startDate = new FormControl();
  endDate = new FormControl();
  destinationConrol = new FormControl();
  orderTypesFormControl = new FormControl();
  statusesFormControl = new FormControl();
  byShiftCheckBoxControl = true; // Shift Switcher 

  /** Dto-шки */
  destinations         : String[]      = [];
  orderTypes           : Codelkup[]    = [];
  statuses             : Codelkup[]    = [];
  dataSource           : PlanRouteHeaderTable[];
  detailDataSource     : PlanRouteDetailTable[] = [];
  
  loading              : boolean  = false;
  filterPanelOpenState : boolean  = true;
  showDates            : boolean  =  false;
  
  menuItems      : MenuItem[];
  selectedDetail : PlanRouteDetailTable;

  constructor(private service : RestService, 
              private _dateFormatPipe: DateFormatPipe,
              private messageService: MessageService,
              private router : Router,
              private colorUtil : TableRowColorUtils) { 
    this.loadStatusFilterData();
    this.loadOrderTypeFilterData();
    this.loadDestinationFilterData();


    
  }

  ngOnInit(){
    
    this.menuItems = [
      {label: 'Выпустить', icon: 'pi pi-fw pi-caret-right', command: () => this.viewProduct(this.selectedDetail)},
      {label: 'Зарезервировать', icon: 'pi pi-fw pi-briefcase', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Отгрузка', icon: 'pi pi-fw pi-sign-out', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Отмена резервировани', icon: 'pi pi-fw pi-times', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Комплектовочная ведомость', icon: 'pi pi-fw pi-file-pdf', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Акт приема/передачи клиенту', icon: 'pi pi-fw pi-file-o', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Сборка по бумаге', icon: 'pi pi-fw pi-file-excel', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Места без отметки', icon: 'pi pi-fw pi-map', command: () => this.deleteProduct(this.selectedDetail)},
      {label: 'Закрыть рейс', icon: 'pi pi-fw pi-check-square', command: () => this.deleteProduct(this.selectedDetail)},
    ];
    
  }

  viewProduct(row: PlanRouteDetailTable) {
    console.log(row);
    this.messageService.add({severity: 'info', summary: 'Product Selected', detail: row.driverName });
}

  deleteProduct(row: PlanRouteDetailTable) {
      this.detailDataSource = this.detailDataSource.filter((p) => p.rowId !== row.rowId);
      this.messageService.add({severity: 'info', summary: 'Product Deleted', detail: row.driverName});
      this.selectedDetail = null;
  }

  
  
  searchClicked() {
    this.loading = true;
    let requestBody : RequestBody = this.createHttpRequestBody();
    this.service.postTableData<PlanRouteHeaderTable>(ControllerURL.ROUTE_PLAN_TABLE_DATA_URL, requestBody).subscribe(response =>{
      this.loading = false;
      this.processHttpResponse(response);
    });
  }


  gotoReplenishmentTask(item :PlanRouteDetailTable): void {
    this.router.navigate(['/replenishment'], { queryParams: { externalloadid: item.externalloadid, loadusr2: item.loadUsr2 }})
  }
  gotoProblemList(item :PlanRouteDetailTable): void {
    this.router.navigate(['/problems'], { queryParams: { externalloadid: item.externalloadid, loadusr2: item.loadUsr2 }})
  }


  processHttpResponse(resp: PlanRouteHeaderTable){
    const HEADER_DATA: PlanRouteHeaderTable[] = [{ 
      planedTasks: resp.planedTasks,
      realTasks: resp.realTasks, 
      remindedTasks: resp.remindedTasks, 
      planedWeight: resp.planedWeight, 
      realWeight:resp.realWeight, 
      remindedWeight:resp.remindedWeight, 
      planedCube: resp.planedCube, 
      realCube:resp.realCube, 
      remindedCube: resp.remindedCube 
    }]

    this.detailDataSource = resp['details'];
    this.dataSource = HEADER_DATA;
  }
  
  
  createHttpRequestBody(): RequestBody {
    let body : RequestBody = {
      orderType : this.arrayToString(this.orderTypesFormControl.value),
      startPeriod : this.startDate.value ? this._dateFormatPipe.transform(this.startDate.value) : "",
      endPeriod : this.endDate.value ? this._dateFormatPipe.transform(this.endDate.value) : "",
      orderStatus : this.arrayToString(this.statusesFormControl.value),
      destination : this.arrayToString(this.destinationConrol.value),
      byShifts : this.byShiftCheckBoxControl
    }
    return body;
  }
  

  loadStatusFilterData(){
    this.service.get<Codelkup[]>(ControllerURL.STATUSES_URL).subscribe(response =>{
      this.statuses = response['codeLookUps'];
    });
  }
  
  loadOrderTypeFilterData(){
    this.service.get<Codelkup[]>(ControllerURL.CODELKUP_URL + "?listName=ORDERTYPE").subscribe(response =>{
      this.orderTypes = response['codeLookUps'];
    });
  }
  
  loadDestinationFilterData(){
    this.service.get<String[]>(ControllerURL.DESTINATION_URL).subscribe(response =>{
      this.destinations = response['routes'];
    });
  }
  
  getOrderTypeDescription(code : string): string {
    return code ? this.orderTypes.filter(item => item.code == code)[0].description : '';
  }
  
  getStatusDescription(code : string): string {
    return code ? this.statuses.filter(item => item.code == code)[0].description : '';
  }

  arrayToString(value : any[]): string{
    return value ? value.join(",") : '';
  }
  getRowColor (item : PlanRouteDetailTable) {
    return this.colorUtil.getRowColor(item);
  }

  getStyleByShift(item : PlanRouteDetailTable ){
    return this.colorUtil.getStyleByShift(item)
  }

}