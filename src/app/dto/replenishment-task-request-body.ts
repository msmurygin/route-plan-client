

export interface ReplenishmentTaskRequestBody {
    externLoadId? : String;
    orderKey? : string;
    changePriority? : boolean;
    priorityValue? : number;
}