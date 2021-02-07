import { environment } from './environment';

export const ControllerURL = {
    LOGIN : environment.apiUrl + environment.PUBLIC + "login",
    LOGOUT : environment.apiUrl + environment.PUBLIC + "logout",
    VERSION_URL : environment.apiUrl + environment.PUBLIC + "version",
    ACTIVE_USERS_URL : environment.apiUrl   + environment.PRIVATE + "activeusers",
    CODELKUP_URL : environment.apiUrl  + environment.PRIVATE + "codelkup",
    STATUSES_URL : environment.apiUrl   + environment.PRIVATE+ "statuses",
    DESTINATION_URL : environment.apiUrl   + environment.PRIVATE+ "routes",
    ROUTE_PLAN_TABLE_DATA_URL : environment.apiUrl   + environment.PRIVATE + "headertable",
    REPLENISHMENT_TASK_URL : environment.apiUrl  + environment.PRIVATE +  "replenishmenttask",
    REPLENISHMENT_PRIORITY_URL : environment.apiUrl  + environment.PRIVATE +  "replenishmentpriority",
    PROBLEM_LIST_URL : environment.apiUrl   + environment.PRIVATE+  "problems",
    NSQLCONFIG_URL : environment.apiUrl   + environment.PRIVATE+  "nsqlconfig",
    ORDER_LIST_URL : environment.apiUrl   + environment.PRIVATE+ "orderlist",
    ORDER_DETAIL_URL : environment.apiUrl  + environment.PRIVATE + "orderdetail",
    SKU_STOCK_URL : environment.apiUrl  + environment.PRIVATE + "skustock",
    CONFIG_URL : environment.apiUrl  + environment.PRIVATE + "config",
    RELEASE_URL : environment.apiUrl  + environment.PRIVATE +"orders/release",
    ALLOCATE_URL : environment.apiUrl  + environment.PRIVATE +"orders/allocate",
    CLOSE_ORDER_URL : environment.apiUrl  + environment.PRIVATE +"orders/close",
    CLOSE_ONE_ORDER_URL : environment.apiUrl  + environment.PRIVATE +"orders/closeorder",
    UNALLOCATE_ORDER_URL : environment.apiUrl  + environment.PRIVATE +"orders/cancel",
    SHIP_ORDER_URL : environment.apiUrl  + environment.PRIVATE + "orders/ship",
    REPORT_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"reports/url",
    SKU_CLAIMS_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"skuclaims",
    CLAIMS_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"claims",
    CLAIMS_DETAIL_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"claimsdetail",
    CLAIMS_SKU_DETAIL_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"skuclaimsdetail",
    CREATE_INV_TASK_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"createtasks",
    SEND_TO_HOST_SERVICE_URL : environment.apiUrl  + environment.PRIVATE +"sendtohost",
    LOCATION_URL : environment.apiUrl  + environment.PRIVATE +"location",
};