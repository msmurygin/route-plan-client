
// Интерфейс запроса http сервиса
export interface RequestBody {
    orderType : string;
    destination : string;
    startPeriod : string;
    endPeriod : string;
    byShifts : boolean;
    orderStatus : string;
  }
  