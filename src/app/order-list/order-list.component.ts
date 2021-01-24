import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { ControllerURL } from 'src/environments/controllers';
import { DateFormatPipe } from '../date-format.pipe';
import { OrderListTable, OrderLineTable } from '../dto/plan-route-detail-table';
import { RestService } from '../rest-service.service';
import { TableRowColorUtils } from '../table-row-color-utils';
import { SelectItem } from 'primeng/api';
import { NavigationURL } from 'src/environments/navigation';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';


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
  
  packingLocations    : SelectItem[]
  editing             : boolean =false;
  private CONFIG_KEY  : string = "LT_LANEVOLUME";
  private TITLE       : string = "Список заказов на отгрузку в рейсе ";
  NAVIGATION           = NavigationURL;
  home                : any;
  nsqlValue           : number;
  nsqlDescription     : String ;
  
  showDates           : boolean = false;      
  loading             : boolean = false;


  menuItems           : MenuItem[]
  orderDataSource     : OrderListTable[];
  selectedOrderLine   : OrderListTable;
  rowGroupMetadata    : any;
  expandedRowKeys     = {}

  constructor(private route          : ActivatedRoute,
              private service        : RestService,
              private _dateFormatPipe: DateFormatPipe,
              private  breadcrumb    : BreadcrumbComponent,
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
  
  
    this.packingLocations = [{label: 'In Stock', value: 'INSTOCK'},{label: 'Low Stock', value: 'LOWSTOCK'},{label: 'Out of Stock', value: 'OUTOFSTOCK'}]
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
        this.loadDataFromRestService(params['externalloadid']);
        this.loading = false;  
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
   * Форматрирование дат
   * @param dateValue 
   */
  transformDate(dateValue: string): any{
    return dateValue ? this._dateFormatPipe.transform(dateValue) : "";
   }
  
  /**
   * Округление дробных чисел
   * TODO: нужно выносить в отдельный сервис
   * @param value 
   */
  round(value : number): number{
    return +value.toFixed(3);
  }
}
