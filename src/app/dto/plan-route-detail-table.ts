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
    truckLeaving: Date;
    shippedItems: number;
    shift:  string;
    routeClosed: number;
    leftToPick: number;
    leftToControl: number;
  }


  // Главная таблица
export interface OrderListTable {
  route : string;
  stop  : number;
  ordersCount : number;
  totalOrderLines: number;
  totalLeftToPickQty: number;
  totalLeftToControlQty: number;
  totalPicked: number;
  totalControlled: number;
  totalPacked: number;
  totalLoaded: number;
  totalCalcQtyLane: number;
  totalStdCube: number;
  totalStdGrossWgt: number;
  totalSelectedCartonIdQty: number;
  details : OrderLineTable[];
}

export interface OrderLineTable{
  stop : number;
  route : string;
  orderKey: string;
  externalOrderKey2: string;
  orderLines : number;
  pickedQty: number;
  controlledQty: number;
  packedQty: number;
  loadedQty: number;
  calcQtyLane: number;
  packingLocation: string;
  door: string;
  stdCube: number;
  stdGrossWgt: number;
  selectedCartonIdQty: number;
  status: string;
  susr2: string;
  reasonCode: number;
  showReason: number;
  addDate: Date;
  routeReady: string;
  actualArrivalDate: Date;
  loadStart: string;
  loadEnd: string;
  loadDuration: string;
  shipDate: string;
  vehicleLeftDate: Date;
  orderClosed: number;
  leftToControl: number;
  leftToPick: number;
}


export interface OrderDetailTable {
  orderLineNumber: string,
  sku:  string,
  descr: string,
  openQty: number,
  qtyAllocated: number,
  qtyPicked: number,
  shippedQty: number,
  qtyLeft: number,
  packKey: string
}


export interface SkuBallanceHeader {
  sku: string;
  descr: string;
  packKey : string;
  openQty: string;
}

export interface SkuBallanceDetail {
  qtyAllocatedTotal: number;
  qtyTotal: number;
  qtyPickedTotal: number;
  qtyAvailable: number;
  skuStock : SkuStock [];
}

export interface SkuStock {
  putawayzone: string;
  descr_ZONE: string;
  loc : string;
  descr_LOC : string;
  status : string;
  qty : number;
  qtyallocated : number;
  qtypicked : number;
  qty_BALANCE : number;
}


export interface Settings {
    hideNotFinishedTask: boolean;
    showLastShiftNotFinishedTask: boolean;
    showNotFinishedTaskInPeriod: boolean;
    showAllNotFinishedTask: boolean;
    hidePlanedTasks: boolean;
    showNextShiftPlanedTasks: boolean;
    showPlanedTaskInPeriod: boolean;
    dayShiftBegin?: number;
    dayShiftEnd?: number;
    nightShiftBegin?: number;
    nightShiftEnd?: number;
}

export interface ShiftWorkTime {
  dayShiftBegin?   :  {value: number, isDirty: boolean}
  dayShiftEnd?     :  {value: number, isDirty: boolean}
  nightShiftBegin? :  {value: number, isDirty: boolean}
  nightShiftEnd?   :  {value: number, isDirty: boolean}
}
