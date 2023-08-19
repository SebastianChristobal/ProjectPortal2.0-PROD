import { SPHttpClient } from "@microsoft/sp-http";

export interface IActivityProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}