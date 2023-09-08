import { SPHttpClient } from "@microsoft/sp-http";

export interface INewTodoProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}