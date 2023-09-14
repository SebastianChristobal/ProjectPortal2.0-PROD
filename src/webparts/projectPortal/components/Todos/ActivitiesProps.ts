import { SPHttpClient } from "@microsoft/sp-http";

export interface ActivitiesProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}