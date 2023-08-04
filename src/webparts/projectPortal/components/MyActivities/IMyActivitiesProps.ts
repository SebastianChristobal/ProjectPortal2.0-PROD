import { SPHttpClient } from "@microsoft/sp-http";
export interface IMyActivitiesProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}