import { Injectable } from "@angular/core";
import { ControllerURL } from "src/environments/controllers";
import { OrderLineTable } from "../dto/plan-route-detail-table";
import { RoutePlanContextMenuService } from "../route-plan-monitor/table-menu-context.service";

@Injectable({
    providedIn: 'root'
  })
export class OrderListContextMenuService extends RoutePlanContextMenuService {

    release(row : any) : void {
        console.log("Relasese")
        this.orderCheckingRoutine(row.route, row.orderClosed, row.pickedQty)
    
        if (this.errorMessages.length > 0){
            this.messageService.addAll(this.errorMessages);
            this.errorMessages = [];
            return;
        }
        
        this.showConfirmDialog(this.RELEASE_TITLE, 
            this.RELEASE_ORDER + row.orderKey + this.QM, 
            () => this.orderOperations.release({orderKey: row.orderKey }));
    }

    allocate(row : any) : void {
        console.log("Allocate")
        this.orderCheckingRoutine(row.route, row.orderClosed, row.pickedQty)
    
        if (this.errorMessages.length > 0){
            this.messageService.addAll(this.errorMessages);
            this.errorMessages = [];
            return;
        }
        
        this.showConfirmDialog(this.ALLOCATE_TITLE, 
            this.ALLOCATE_ORDER + row.orderKey + this.QM, 
            () => this.orderOperations.allocate({orderKey: row.orderKey }));
    }

    cancel(row : any){
        this.orderCheckingRoutine(row.route, row.routeClosed, row.picked)
        if (this.errorMessages.length > 0){
          this.messageService.addAll(this.errorMessages);
          this.errorMessages = [];
          return;
        }
        this.showConfirmDialog(this.UN_ALLOCATE_TITLE, 
                               this.UN_ALLOCATE_ORDER + row.orderKey + this.QM, 
                               () => this.orderOperations.unallocate({orderKey: row.orderKey }));
    }


    ship(row : any){
        this.checkIfRouteIsClosed(row.route, row.routeClosed)
        if (this.errorMessages.length > 0){
          this.messageService.addAll(this.errorMessages);
          this.errorMessages = [];
          return;
        }
        this.showConfirmDialog(this.SHIP_TITLE, 
                               this.SHIP_ORDER + row.orderKey + this.QM, 
                               () => this.orderOperations.ship({orderKey: row.orderKey }));
    }




    close(row : any) : void {
        console.log("close")
        this.checkIfRouteIsClosed(row.route, row.orderClosed)
        if (this.errorMessages.length > 0){
            this.messageService.addAll(this.errorMessages);
            this.errorMessages = [];
            return;
        }
        
        this.showConfirmDialog(this.CLOSE_TITLE, 
            this.CLOSE_ORDER + row.orderKey + this.QM, 
            () => this.orderOperations.close(ControllerURL.CLOSE_ONE_ORDER_URL,{orderKey: row.orderKey }));
    }
}