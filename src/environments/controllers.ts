import { environment } from './environment';

export const ControllerURL = {
    ACTIVE_USERS_URL : environment.apiUrl + "activeusers",
    CODELKUP_URL : environment.apiUrl + "codelkup",
    STATUSES_URL : environment.apiUrl + "statuses",
    DESTINATION_URL : environment.apiUrl + "routes",
    ROUTE_PLAN_TABLE_DATA_URL : environment.apiUrl + "headertable",
    REPLENISHMENT_TASK_URL : environment.apiUrl +  "replenishmenttask",
    PROBLEM_LIST_URL : environment.apiUrl +  "problems",
};