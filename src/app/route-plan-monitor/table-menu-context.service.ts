import { Injectable } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ControllerURL } from 'src/environments/controllers';
import { OrderLineTable, OrderListTable, PlanRouteDetailTable } from '../dto/plan-route-detail-table';
import { OrderRestService } from './Operation';

@Injectable({
  providedIn: 'root'
})
export class RoutePlanContextMenuService {
  protected RELEASE_TITLE = "Выпуск";
  protected RELEASE_ROUTE = "Выпустить рейс ";
  protected RELEASE_ORDER = "Выпустить заказ ";

  protected ALLOCATE_TITLE = "Резервирование";
  protected ALLOCATE_ROUTE = "Зарезервировать рейс ";
  protected ALLOCATE_ORDER = "Зарезервировать заказ ";

  protected CLOSE_TITLE = "Закрытие";
  protected CLOSE_ROUTE = "Закрыть рейс ";
  protected CLOSE_ORDER = "Закрыть заказ ";

  protected UN_ALLOCATE_TITLE = "Разрезервирование";
  protected UN_ALLOCATE_ROUTE = "Разрезервировать рейс ";
  protected UN_ALLOCATE_ORDER = "Разрезервировать заказ ";

  protected SHIP_TITLE = "Отгрузка";
  protected SHIP_ROUTE = "отгрузить рейс ";

  protected SHIP_ORDER= "отгрузить заказ ";

  protected QM  = " ?";


  constructor(protected confirmationService: ConfirmationService,
              protected messageService : MessageService,
              protected orderOperations : OrderRestService) { }

  errorMessages : Message[] = [];
  
  
  /** Резервирвоания заказов из плана рейсов */
  release(row: PlanRouteDetailTable) {
    
    this.orderCheckingRoutine(row.route, row.routeClosed, row.picked)
    
    if (this.errorMessages.length > 0){
        this.messageService.addAll(this.errorMessages);
        this.errorMessages = [];
        return;
    }
    this.showConfirmDialog(this.RELEASE_TITLE, 
                           this.RELEASE_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.release({loadUsr2: row.loadUsr2, externalLoadId: row.externalloadid }));
  }







  
  allocate(row: PlanRouteDetailTable) {
    this.orderCheckingRoutine(row.route, row.routeClosed, row.picked)
    if (this.errorMessages.length > 0){
        this.messageService.addAll(this.errorMessages);
        this.errorMessages = [];
        return;
    } 
    this.showConfirmDialog( this.ALLOCATE_TITLE, 
                            this.ALLOCATE_ROUTE + row.loadUsr2 + this.QM, 
                            () => this.orderOperations.allocate({loadUsr2: row.loadUsr2, externalLoadId: row.externalloadid }));
  }





  cancelAllocation(row: PlanRouteDetailTable){
    this.orderCheckingRoutine(row.route, row.routeClosed, row.picked)
    if (this.errorMessages.length > 0){
        this.messageService.addAll(this.errorMessages);
        this.errorMessages = [];
        return;
    } 
    this.showConfirmDialog(this.UN_ALLOCATE_TITLE, 
                           this.UN_ALLOCATE_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.unallocate({loadUsr2: row.loadUsr2, externalLoadId: row.externalloadid }));
  }



  closeRoute(row: PlanRouteDetailTable){
    this.checkIfRouteIsClosed(row.route, row.routeClosed)
    if (this.errorMessages.length > 0){
      this.messageService.addAll(this.errorMessages);
      this.errorMessages = [];
      return;
    }
    this.showConfirmDialog(this.CLOSE_TITLE, 
                           this.CLOSE_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.close(ControllerURL.CLOSE_ORDER_URL,{loadUsr2: row.loadUsr2, externalLoadId: row.externalloadid }));
  }


  ship(row: PlanRouteDetailTable){
    this.checkIfRouteIsClosed(row.route, row.routeClosed)
    if (this.errorMessages.length > 0){
      this.messageService.addAll(this.errorMessages);
      this.errorMessages = [];
      return;
    }
    this.showConfirmDialog(this.SHIP_TITLE, 
                           this.SHIP_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.ship({loadUsr2: row.loadUsr2, externalLoadId: row.externalloadid }));
  }


  pickList(row: PlanRouteDetailTable){
    this.orderOperations.picklist(row)
  }

  acceptenceAct(row: PlanRouteDetailTable){
    this.orderOperations.acceptenceact(row)
  }

  pickByPaper(row: PlanRouteDetailTable){
    this.orderOperations.pickbypaper(row)
  }

  placesWithNoMarks(row: PlanRouteDetailTable){
    this.orderOperations.placewithnomarks(row)
  }


  protected orderCheckingRoutine(route: string, closed: number, picked: number): void {
    this.checkIfRouteIsClosed(route, closed);
    this.checkIfOperationPermitted(picked);
  }

  /**
   * Проверка если рейс уже закрыт
   * @param row 
   */
  checkIfRouteIsClosed (routeId: string, routeClosed : number){
    console.log(routeClosed)
    if ( routeClosed == 1){
      this.errorMessages.push({
        life: 5000, 
        closable: true, 
        severity: 'error', 
        summary: 'Ошибка', 
        detail: "Рейс "+routeId+" закрыт." 
      });
    }
  }


  /**
   * Любая операция запрещена если отобранно >=100 %
   * @param row 
   */
  checkIfOperationPermitted (qtyPicked : number) {
  
    if (qtyPicked >= 100){
      this.errorMessages.push({
        life: 5000, 
        closable: true, 
        severity: 'error', 
        summary: 'Заблокировано', 
        detail: "Выпуск, резервирование, отмена резервирования - запрещено!" 
      });
    }
  }



  /**
   * Диалоговое окно подтверждения операции
   * @param _header 
   * @param _message 
   * @param command 
   */
  showConfirmDialog(_header: string, _message: string, command : (event?: any) => void) {
    console.log("showing confirm dialog...")
    this.confirmationService.confirm({
      message: _message,
      header: _header,
      accept: () => {
        command();
      }
    });
  }

}


