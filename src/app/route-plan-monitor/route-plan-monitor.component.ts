import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerURL } from 'src/environments/controllers';
import { RestService } from '../rest-service.service';
import   Codelkup from '../dto/codelkup';
import { DateFormatPipe } from '../date-format.pipe';
import { MenuItem, MessageService } from 'primeng/api';
import { PlanRouteDetailTable } from '../dto/plan-route-detail-table';
import { PlanRouteHeaderTable } from '../dto/plan-route-header-table';
import { RequestBody } from '../dto/plan-route-request-body';
import { Router } from '@angular/router';
import { TableRowColorUtils } from '../table-row-color-utils';
import {NavigationURL} from '../../environments/navigation';
import { RoutePlanContextMenuService } from './table-menu-context.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ReplenishmentTaskRequestBody } from '../dto/replenishment-task-request-body';
import { AuthService } from '../login/auth.service';


/** структура для обновления данных таблицы POST запрос */
export interface ITableUpdateRequestBody {
  details: PlanRouteDetailTable[]
}


export interface ILocations{
  code  : string;
  name : string;
}



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
  rows = 10;
  first = 0;
  pageEvent : {}; // Хранитель состояния пагинации
  startDate = new FormControl();
  endDate = new FormControl();
  destinationConrol = new FormControl();
  orderTypesFormControl = new FormControl();
  statusesFormControl = new FormControl();
  private _byShiftCheckBoxControl  : boolean = false;// Shift Switcher 
  private _showDates               : boolean  = false;



  /** Dto-шки */
  destinations         : String[]      = [];
  orderTypes           : Codelkup[]    = [];
  statuses             : Codelkup[]    = [];
  dataSource           : PlanRouteHeaderTable[];
  detailDataSource     : PlanRouteDetailTable[] = [];
 
  loading              : boolean  = false;

  selectedDetail       : PlanRouteDetailTable;
  menuItems            : MenuItem[];
  NAVIGATION           = NavigationURL;
  

  //Auto update functionality
  refreshIntervalId    : any;
  autoUpdate           : boolean = false;
 
  // Drop down batch select/unselect vars
  orderTypeAllSelected = false;
  destinationAllSelected = false;
  orderStatusAllSelected = false;
  @ViewChild('orderTypeSelect') orderTypeSelect: MatSelect;
  @ViewChild('orderStatusSelect') orderStatusSelect: MatSelect;
  @ViewChild('destinationSelect') destinationSelect: MatSelect;


  //***********************************************************
  // Editing table ********************************************
  //***********************************************************
  doorDataSource             : ILocations[] = [];
  packingLocationDataSource  : ILocations[] = [];
  modifiedRows               : PlanRouteDetailTable[] = [];
  
  constructor(private service : RestService, 
              private _dateFormatPipe: DateFormatPipe,
              private messageService: MessageService,
              private router : Router,
              private colorUtil : TableRowColorUtils,
              private menuAction: RoutePlanContextMenuService,
              private auth      : AuthService) { 
    this.loadStatusFilterData();
    this.loadOrderTypeFilterData();
    this.loadDestinationFilterData();

    /** Подписываемся на события на именения фильтров  */

    this.destinationConrol.valueChanges.subscribe(changes=>{
      sessionStorage.setItem("dest-filter", changes)
    })

    this.startDate.valueChanges.subscribe(changes =>{
      sessionStorage.setItem("startDate-filter", this._dateFormatPipe.transform(changes))
    })
    this.endDate.valueChanges.subscribe(changes => {
      sessionStorage.setItem("endDate-filter", this._dateFormatPipe.transform(changes))
    })

    this.statusesFormControl.valueChanges.subscribe(changes =>{
      sessionStorage.setItem("status-filter", changes)
    })
    this.orderTypesFormControl.valueChanges.subscribe(changes =>{
      sessionStorage.setItem("orderType-filter", changes)
    })



    /**** Загрузка фильтров из хранилища сессий */
    this.pageEvent = JSON.parse(sessionStorage.getItem("route_monitor_items_per_page-filter")) || {first: 0, rows: 10};
    if (this.pageEvent){
      this.rows = this.pageEvent['rows']
      this.first = this.pageEvent['first']
    }
    let _startDate : string = sessionStorage.getItem("startDate-filter");
    let _endDate : string   = sessionStorage.getItem("endDate-filter");
    let _byShift : string   = sessionStorage.getItem("byshift-filter");
    let _showDate : string  = sessionStorage.getItem("showdates-filter");
    if (_startDate) this.startDate.patchValue(new  Date(_startDate))
    if (_endDate)this.endDate.patchValue(new  Date(_endDate))
    if (_byShift)this.byShiftCheckBoxControl = (_byShift=="true")
    if (_showDate)this.showDates = (_showDate == "true")
    /****************************************** */
   
  }

  onPage(event){
    this.pageEvent = event;
    sessionStorage.setItem("route_monitor_items_per_page-filter", JSON.stringify(event))
  }
  
  ngOnInit(){
    let   replMenuItems        : MenuItem[] = [
      {label: 'Поднять приоритет', icon: 'pi pi-arrow-circle-up', command: () => this.changeReplenishmentPriority(this.selectedDetail, 1)},
      {label: 'Понизить приоритет', icon: 'pi pi-arrow-circle-down', command: () => this.changeReplenishmentPriority(this.selectedDetail, -1)}
    ];
    this.menuItems = [
      {label: 'Детали', icon: 'pi pi-list', command: () => this.gotoReplenishmentTask(this.selectedDetail)},
      {visible : this.auth.isAdmin(), label: 'Пополнение',icon: 'pi pi-download', items: replMenuItems},
      {visible : this.auth.isAdmin(), label: 'Выпустить', icon: 'pi pi-fw pi-caret-right', command: () => this.menuAction.release(this.selectedDetail)},
      {visible : this.auth.isAdmin(), label: 'Зарезервировать', icon: 'pi pi-fw pi-briefcase', command: () => this.menuAction.allocate(this.selectedDetail)},
      {visible : this.auth.isAdmin(), label: 'Отгрузка', icon: 'pi pi-fw pi-sign-out', command: () => this.menuAction.ship(this.selectedDetail)},
      {visible : this.auth.isAdmin(), label: 'Отмена резервировани', icon: 'pi pi-fw pi-times', command: () => this.menuAction.cancelAllocation(this.selectedDetail)},
      {visible : true, label: 'Комплектовочная ведомость', icon: 'pi pi-fw pi-file-pdf', command: () => this.menuAction.pickList(this.selectedDetail)},
      {visible : true, label: 'Акт приема/передачи клиенту', icon: 'pi pi-fw pi-file-o', command: () => this.menuAction.acceptenceAct(this.selectedDetail)},
      {visible : true, label: 'Сборка по бумаге', icon: 'pi pi-fw pi-file-excel', command: () => this.menuAction.pickByPaper(this.selectedDetail)},
      {visible : true, label: 'Места без отметки', icon: 'pi pi-fw pi-map', command: () => this.menuAction.placesWithNoMarks(this.selectedDetail)},
      {visible : this.auth.isAdmin(), label: 'Закрыть рейс', icon: 'pi pi-fw pi-check-square', command: () => this.menuAction.closeRoute(this.selectedDetail)},
    ]; 
   
  }

  loadPackingLocation(){
    let request = {
      locationType : "PICKTO",
      locationCategory : "PACK"
    }
    this.service.post(ControllerURL.LOCATION_URL, request).subscribe(data => {
      let locs : string[] = data['locations'] ;
      locs.forEach(item =>{
        this.packingLocationDataSource.push({code: item, name: item});
      })
    })
  }

  loadDoors(){
    let request = {
      locationType : "DOOR",
      locationCategory : "DOOR"
    }
    this.service.post(ControllerURL.LOCATION_URL, request).subscribe(data => {
      let locs : string[] = data['locations'] ;
      locs.forEach(item =>{
        this.doorDataSource.push({code: item, name: item});
      })
    })
  }

  
  searchClicked() {
    this.loading = true;
    let requestBody : RequestBody = this.createHttpRequestBody();
    this.service.post<PlanRouteHeaderTable>(ControllerURL.ROUTE_PLAN_TABLE_DATA_URL, requestBody).subscribe(response =>{
      
      // Loading table input comboboxes
      this.loadPackingLocation();
      this.loadDoors();
      //

      this.loading = false;
      this.processHttpResponse(response);
    });
  }
  
  
  gotoReplenishmentTask(item :PlanRouteDetailTable): void {
    this.router.navigate([this.NAVIGATION.REPLENISHMENT.url], { queryParams: { externalloadid: item.externalloadid, loadusr2: item.loadUsr2 }})
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
    // Format dates 
    this.detailDataSource.forEach(item =>{
      if (item.deliveryDate){
        item.deliveryDate = new Date(item.deliveryDate)
      }
      if (item.actualArrivalDate) {
        item.actualArrivalDate = new Date(item.actualArrivalDate)
      } 
      if (item.truckLeaving) {
        item.truckLeaving = new Date(item.truckLeaving)
      } 
    });
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
      
      /*** Загрузка сохраненных фильтров */
      let savedFilterValue   : string = sessionStorage.getItem("status-filter")
      if (savedFilterValue){
        let valAsArray: string []  = savedFilterValue.split(",")
        this.statusesFormControl.patchValue(valAsArray);
      }
      /******************************* */
    });
  }
  
  loadOrderTypeFilterData(){
    this.service.get<Codelkup[]>(ControllerURL.CODELKUP_URL + "?listName=ORDERTYPE").subscribe(response =>{
      this.orderTypes = response['codeLookUps'];
      /*** Загрузка сохраненных фильтров */
      let savedFilterValue   : string = sessionStorage.getItem("orderType-filter")
      if (savedFilterValue){
        let valAsArray: string []  = savedFilterValue.split(",")
        this.orderTypesFormControl.patchValue(valAsArray);
      }
      /******************************* */
    });
  }
  
  loadDestinationFilterData(){
    this.service.get<String[]>(ControllerURL.DESTINATION_URL).subscribe(response =>{
      this.destinations = response['routes'];

      /*** Загрузка сохраненных фильтров */
      let savedFilterValue   : string = sessionStorage.getItem("dest-filter")
      
      if (savedFilterValue){
        let valAsArray: string []  = savedFilterValue.split(",")
        this.destinationConrol.setValue(valAsArray);
        console.log(this.destinationConrol.value)
      }
      this.searchClicked();
      /******************************* */
    });
  }
  
  getOrderTypeDescription(code : string): string {
    return code && this.orderTypes ? this.orderTypes.filter(item => item.code == code)[0].description : '';
  }
  
  getStatusDescription(code : string): string {
    return code ? this.statuses.filter(item => item.code == code)[0].description : '';
  }

  arrayToString(value : any[]): string{
    return value ? value.join(",") : '';
  }
  getRowColor (item : PlanRouteDetailTable) {
    return this.colorUtil.getStyleByReasonCode(item)+ " " + this.getCursorForReasonCell(item);
  }

  getStyleByShift(item : PlanRouteDetailTable ){
    return this.colorUtil.getStyleByShift(item)
  }

  // ************* Выбрать все в выпадающих справочниках ******************************//

  toogleOrderTypeSelect() {
    this.orderTypeAllSelected = !this.orderTypeAllSelected;  // to control select-unselect
    if (this.orderTypeAllSelected) {
      this.orderTypeSelect.options.forEach( (item : MatOption) => item.select());
    } else {
      this.orderTypeSelect.options.forEach( (item : MatOption) => {item.deselect()});
    }
    this.orderTypeSelect.close();
  }


  toogleStatusSelect() {
    this.orderStatusAllSelected = !this.orderStatusAllSelected;  // to control select-unselect
    if (this.orderStatusAllSelected) {
      this.orderStatusSelect.options.forEach( (item : MatOption) => item.select());
    } else {
      this.orderStatusSelect.options.forEach( (item : MatOption) => {item.deselect()});
    }
    this.orderStatusSelect.close();
  }

  toogleDestinationSelect() {
    this.destinationAllSelected = !this.destinationAllSelected;  // to control select-unselect
    if (this.destinationAllSelected) {
      this.destinationSelect.options.forEach( (item : MatOption) => item.select());
    } else {
      this.destinationSelect.options.forEach( (item : MatOption) => {item.deselect()});
    }
    this.destinationSelect.close();
  }


  toogleAutoUpdate(){
    this.autoUpdate = !this.autoUpdate;
    if (this.autoUpdate){
       this.refreshIntervalId =  setInterval(() => { this.searchClicked();}, 10000);
    }else{
      clearInterval(this.refreshIntervalId)
    }
  }

  //******************************************** */
  // При клике на редактируемое поле в таблице, 
  // временно фиксируем значение в переменной
  // focusValue, для того, чтобы потом определить
  // поменялось ли значение или нет
  focusValue : any;
  onEditInit(event) : void {
    this.focusValue = event.data[event.field] 
  }


  onEditComplete(event): void {
    if (event.data[event.field] == " " || event.data[event.field] == this.focusValue) return;

    if (this.modifiedRows){
      let alreadyModified : any = this.modifiedRows.filter(item => item.rowId == event.data['rowId'])
      if (alreadyModified.length > 0) {
        let modifiedObject = alreadyModified[0];
        let index = this.modifiedRows.indexOf(modifiedObject);
        if (index >-1) this.modifiedRows.splice(index, 1);
      }
      this.modifiedRows.push(event.data)
     
    }
    console.log(this.modifiedRows)
  }

  save(){
    if ( this.modifiedRows && this.modifiedRows.length > 0 ){
      let body : ITableUpdateRequestBody = {
        details : [... this.modifiedRows]
      }
      this.service.put(ControllerURL.ROUTE_PLAN_TABLE_DATA_URL, body).subscribe(response =>{
        this.messageService.add({life: 10000, closable:true, severity: 'success', summary: 'Операция прошла успешно', detail: "Данные обновлены" });
        this.cancel();
      })
    }
  }

  cancel(){
    if (this.modifiedRows){
      while (this.modifiedRows.length) {
        this.modifiedRows.pop();
      }
      this.searchClicked();
    }
    
  }



  changeReplenishmentPriority(row : PlanRouteDetailTable, dir: number){
    console.log(row)
    let body : ReplenishmentTaskRequestBody = {
      externLoadId   : row.externalloadid == row.loadUsr2? null : row.externalloadid,
      orderKey       : row.externalloadid == row.loadUsr2? row.externalloadid : null,
      changePriority : true,
      priorityValue  : dir
    }
    this.service.post(ControllerURL.REPLENISHMENT_TASK_URL, body).subscribe(response => {
      if ( response['replenishmentTasks']){
        let size : number  = response['replenishmentTasks'].length;
        let msg  : string  = "У "+ size + " позиций поменялся приоритет";
        this.messageService.add({life: 10000, closable:true, severity: 'success', summary: 'Операция прошла успешно', detail: msg });
      }
    })
  }


  public get byShiftCheckBoxControl(): boolean{
    return this._byShiftCheckBoxControl;
  }

  public set byShiftCheckBoxControl(value : boolean){
    sessionStorage.setItem("byshift-filter", ""+value)
    this._byShiftCheckBoxControl  = value;
  }

  public get showDates(): boolean{
    return this._showDates;
  }

  public set showDates(value : boolean){
    sessionStorage.setItem("showdates-filter", ""+value)
    this._showDates  = value;
  }

  selectedRowStyleName : string;
  selectedRowStyle : any; // Saving row ref

  onRowSelect(event: any, template?: any) {
   
    // check if previous row has been saved
    if (this.selectedRowStyle){
      let elementChildrens = this.selectedRowStyle.children;
      for (var i=0, child; child=elementChildrens[i]; i++) {
        if (!child.classList.contains('td_detail_buttons')) {
            child.classList.add(this.selectedRowStyleName)
            child.classList.remove("selected_row")
        }
      }
      
      this.selectedRowStyle.classList.remove("td_detail_no_style")
    }
    // prev saved style 
    this.selectedRowStyle = event['originalEvent'].path[1];


    let elementChildrens: HTMLCollection = this.selectedRowStyle.children;
    for (var i=0, child; child=elementChildrens[i]; i++) {
        let classList = child.classList;
        if (classList.contains('p-text-center')) return;
        if (classList.contains('td_detail_buttons')) break;
        for (var j=0; j < classList.length; j++){
          var element = classList[j];
          if (element.indexOf('td_detail') != -1){
            this.selectedRowStyleName = element;
            break;
          }
        }
        child.classList.remove(this.selectedRowStyleName)
        child.classList.add('selected_row')
    }
    event['originalEvent'].path[1].classList.add("td_detail_no_style")
    
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  getCursorForReasonCell(item : PlanRouteDetailTable) : string  {
    return item.showReason === 1 ? "edit-cursor" : "";
  }

  onReasonClick(item : PlanRouteDetailTable) : void {
    console.log(item)

    if (item.showReason === 1){
      this.router.navigate([this.NAVIGATION.PROBLEMS.url, { externalloadid: item.externalloadid, loadusr2: item.loadUsr2}])
    }
  }
}
