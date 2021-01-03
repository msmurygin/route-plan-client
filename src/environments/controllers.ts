import { environment } from './environment';

export const ControllerURL = {
    ACTIVE_USERS_URL : environment.apiUrl + "activeusers",
    CODELKUP_URL : environment.apiUrl + "codelkup",
    STATUSES_URL : environment.apiUrl + "statuses",
    DESTINATION_URL : environment.apiUrl + "routes"
};