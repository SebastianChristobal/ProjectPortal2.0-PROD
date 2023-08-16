import { SPHttpClient } from "@microsoft/sp-http";

export interface INewActivityProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}