import { SPHttpClient } from "@microsoft/sp-http";
export interface ActivitiesAndControlpointsProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}