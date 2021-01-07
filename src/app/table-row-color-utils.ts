import { Injectable } from "@angular/core";
import { PlanRouteDetailTable } from "./dto/plan-route-detail-table";

@Injectable()
export class TableRowColorUtils {
    

    getRowColorWithoutShiftsColor(item : any): string {
        console.log(item.reasonCode)
        if (item.reasonCode == 2) return "reason_red";
        if (item.reasonCode == 3) return "reason_purple";
        if (item.reasonCode == 1) return "reason_gray";
        return "";
    }

    getRowColor (item : PlanRouteDetailTable) {
        if (item.reasonCode == 5) return "reason_purple";
        if (item.reasonCode == 4) return "reason_red";
        if (item.reasonCode == 3) return "reason_gray";
        if (item.reasonCode == 2) return "reason_yellow";
        if (item.reasonCode == 1) return "reason_green";
    
        return this.getStyleByShift(item);
      }
    
      getStyleByShift(item : PlanRouteDetailTable ){
        if (item.shift =='День')
          return 'td_detail_day'
        else if (item.shift == 'Ночь')
          return 'td_detail_night'
        else 
        return 'td_detail';
      }
}