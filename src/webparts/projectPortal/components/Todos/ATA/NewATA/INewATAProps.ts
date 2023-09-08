import { SPHttpClient } from "@microsoft/sp-http";

export interface INewATAProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}