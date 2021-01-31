import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { ControllerURL } from 'src/environments/controllers';
import { DateFormatPipe } from '../date-format.pipe';
import { OrderListTable, OrderLineTable } from '../dto/plan-route-detail-table';
import { RestService } from '../rest-service.service';
import { TableRowColorUtils } from '../table-row-color-utils';
import { MessageService, SelectItem } from 'primeng/api';
import { NavigationURL } from 'src/environments/navigation';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ILocations } from '../route-plan-monitor/route-plan-monitor.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TableMenuContextService } from '../route-plan-monitor/table-menu-context.service';

export interface IBodyRequest{
  orderList : IOrderListUpdateRequestBody[];
}

export interface IOrderListUpdateRequestBody {
  orderKey: string;
  packingLocation : string;
  door : string;
  vehicleArrival : Date;
  vehicleLeaving : Date;
}


@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  styles: [`
  :host ::ng-deep .p-cell-editing {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
  }
`]
})
export class OrderListComponent implements OnInit {
  
  NAVIGATION           = NavigationURL;
  private CONFIG_KEY  : string = "LT_LANEVOLUME";
  private TITLE       : string = "Список заказов на отгрузку в рейсе ";

  doorDataSource             : ILocations[] = [];
  packingLocationDataSource  : ILocations[] = [];
  modifiedRows               : OrderLineTable[] = [];
  packingLocations           : SelectItem[]
  editing                    : boolean =false;
 
  externalLoadId      : string;
  loadUsr2            : string;
 
  home                : any;
  nsqlValue           : number;
  nsqlDescription     : String ;
  
  showDates           : boolean = true;      
  loading             : boolean = false;


  menuItems           : MenuItem[]
  orderDataSource     : OrderListTable[];
  selectedOrderLine   : OrderLineTable;
  rowGroupMetadata    : any;
  expandedRowKeys     = {}

  constructor(private route          : ActivatedRoute,
              private service        : RestService,
              private messageService: MessageService,
              private  breadcrumb    : BreadcrumbComponent,
              private menuAction: TableMenuContextService,
              private colorUtil      : TableRowColorUtils) { 
    this.home = {icon: 'pi pi-home', routerLink: '/'};
   
  }

  ngOnDestroy(): void {
    this.breadcrumb.unregister(NavigationURL.ORDER_LIST.name);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.processQueryParamsAndLoadTableData(params);
    });
    this.loadNsqlConfigDataFromRestService(); 
    this.updateRowGroupMetaData();
    this.modifiedRows = [];

    this.menuItems = [
      {label: 'Выпустить', icon: 'pi pi-fw pi-caret-right', command: () => this.release()},
      {label: 'Зарезервировать', icon: 'pi pi-fw pi-briefcase', },
      {label: 'Отгрузка', icon: 'pi pi-fw pi-sign-out', },
      {label: 'Отмена резервировани', icon: 'pi pi-fw pi-times', },
      {label: 'Закрыть рейс', icon: 'pi pi-fw pi-check-square',},
    ]; 
  }

   release(){
     this.selectedOrderLine['externalLoadId'] = this.externalLoadId;
     this.selectedOrderLine['loadusr2'] = this.loadUsr2;
     //this.menuAction.releaseOrder(this.selectedOrderLine);
   }

  /**
   * Обработка входящих параметров запроса
   * цепочка выозова loadDataFromRestService
   * @param params 
   */
  processQueryParamsAndLoadTableData(params: Params){
    if (params){
      if (params['externalloadid']) {
        this.loading = true;
        this.externalLoadId = params['externalloadid']
        this.loadDataFromRestService(params['externalloadid']);
        // Loading dropdown lists DS
        this.loadPackingLocation();
        this.loadDoors();
        this.loading = false;  
      }

      if (params['loadusr2']) {
        this.loadUsr2 = params['loadusr2']
      }
    }
    
  }



  /**
   * Загружаем из api значение nsqlconfig = LT_LANEVOLUME
   */
  loadNsqlConfigDataFromRestService(){
    this.service.get(ControllerURL.NSQLCONFIG_URL + "?configKey=" + this.CONFIG_KEY ).subscribe(response =>{
      if (response['nsqConfig']){
        this.nsqlValue = +response['nsqConfig']['nsqlValue'];
        this.nsqlDescription = response['nsqConfig']['nsqlDescript'];
      }
    })
  }

  /**
   * Загружаем данные таблицы с api
   * @param externalLoadId - параметр для передачи рест сервису
   */
  loadDataFromRestService(externalLoadId: string): void{
    this.loading = true;
    this.service.get<OrderListTable>(ControllerURL.ORDER_LIST_URL + "?externalLoadId=" + externalLoadId).subscribe(response =>{
      this.loading = false; 
      this.orderDataSource = response['orderList'];

      this.orderDataSource.forEach(routeDetail=>{
         
          // Format dates 
          routeDetail.details.forEach(item =>{
            if (item.actualArrivalDate) {
              item.actualArrivalDate = new Date(item.actualArrivalDate)
            } 
            if (item.addDate) {
              item.addDate = new Date(item.addDate)
            } 
            if (item.vehicleLeftDate) {
              item.vehicleLeftDate = new Date(item.vehicleLeftDate)
            } 
          });
      });
      this.expandAllRows()
    });
  }

  
  /**
   * Обёртка над функцией группирующей по маршруту
   */
  onSort() {
    this.updateRowGroupMetaData();
  }
  
  /**
   * Группируем таблицу по маршруту
   */
  updateRowGroupMetaData() {
      this.rowGroupMetadata = {};

      if (this.orderDataSource) {
          for (let i = 0; i < this.orderDataSource.length; i++) {
              let rowData = this.orderDataSource[i];
              let route = rowData.route;
              
              if (i == 0) {
                  this.rowGroupMetadata[route] = { index: 0, size: 1 };
              }
              else {
                  let previousRowData = this.orderDataSource[i - 1];
                  let previousRowGroup = previousRowData.route;
                  if (route === previousRowGroup)
                      this.rowGroupMetadata[route].size++;
                  else
                      this.rowGroupMetadata[route] = { index: i, size: 1 };
              }
          }
      }
  }

  /**
   * Данный методе заполняет объект
   * expandedRowKeys названием маршрутов, 
   * так как они являются группировкой для 
   * строк в таблице, которые нужно заэкспандить по умолчанию
   */
  expandAllRows(){
    console.log(this.orderDataSource)
    for (let data of this.orderDataSource) {
      this.expandedRowKeys[data.route] = true;
    }
  }

  /**
   * Возвращает детали каждой группы таблицы
   * @param item  - объект данных строки таблицы
   */
  getDetail(item : OrderListTable) :OrderLineTable[] {
    return item.details;
  }


  /**
   * Подбирает нужны стиль в зависимости от причины
   * item.reasonCode
   * @param item - объект данных строки таблицы
   */
  getRowColor (item : any) {
    return this.colorUtil.getStyleByReasonCode(item);
  }


  /**
   * Округление дробных чисел
   * TODO: нужно выносить в отдельный сервис
   * @param value 
   */
  round(value : number): number{
    return +value.toFixed(3);
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
    if (event.data['details']){
      let details = event.data['details'];
      details.forEach(element => {
        element[event.field] = event.data[event.field];
        this.modifiedRows.push(element)
      });
    
      event.data[event.field] ='';
      return;
    }
    if (this.modifiedRows){
      let alreadyModified : any = this.modifiedRows.filter(item => (item.route == event.data['route'] && item.orderKey == event.data['orderKey'] ))
      if (alreadyModified.length > 0) {
        let modifiedObject = alreadyModified[0];
        let index = this.modifiedRows.indexOf(modifiedObject);
        if (index >-1) this.modifiedRows.splice(index, 1);
      }
      this.modifiedRows.push(event.data)
    }
    console.log(event);
    
  }



  save(){
    if ( this.modifiedRows && this.modifiedRows.length > 0 ){
      let body : IBodyRequest
      let bodyItem : IOrderListUpdateRequestBody[] = []
      this.modifiedRows.forEach(item =>{
         let orderDetailList : IOrderListUpdateRequestBody = {
           orderKey : item.orderKey,
           door     : item.door,
           packingLocation : item.packingLocation,
           vehicleArrival  : item.actualArrivalDate,
           vehicleLeaving  : item.vehicleLeftDate
         }
         bodyItem.push(orderDetailList);
      });

      body = {
        orderList : [...bodyItem]
      }
      this.service.put(ControllerURL.ORDER_LIST_URL, body).subscribe(response =>{
        if (response){
          this.messageService.add({life: 10000, closable:true, severity: 'success', summary: 'Операция прошла успешно', detail: "Данные обновлены" });
          this.cancel();
          this.ngOnInit();
        }
      })
    }
  }

  cancel(){
    if (this.modifiedRows){
      while (this.modifiedRows.length) {
        this.modifiedRows.pop();
      }
    }
  }
}
