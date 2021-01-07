// Главная таблица
export interface PlanRouteDetailTable {
    rowId: number;
    externalloadid:  string;
    deliveryDate: Date;
    loadUsr2 : string;
    route:  string;
    replenishmentTask: string;
    reasonCode: number;
    showReason: number;
    stdCube: number;
    stdGrossWgt: number;
    picked: number;
    controlled: number;
    packed: number;
    loaded: number;
    status:  string;
    itemsInRoute: number;
    packingLocation:  string;
    door:  string;
    susr2:  string;
    driverName:  string;
    loadUsr1:  string;
    addDate: Date;
    routeReady: Date;
    actualArrivalDate: Date;
    loadStart: Date;
    loadEnd: Date;
    loadDuration: string;
    shipped: number;
    truckLeaving: number;
    shippedItems: number;
    shift:  string;
    routeClosed: number;
    leftToPick: number;
    leftToControl: number;
  }