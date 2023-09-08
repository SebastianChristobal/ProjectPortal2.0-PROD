import { SPHttpClient } from "@microsoft/sp-http";

export interface ITodosProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}