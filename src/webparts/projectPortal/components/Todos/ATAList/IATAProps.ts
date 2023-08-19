import { SPHttpClient } from "@microsoft/sp-http";

export interface IATAProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}