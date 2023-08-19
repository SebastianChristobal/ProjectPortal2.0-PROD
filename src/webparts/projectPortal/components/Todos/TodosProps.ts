import { SPHttpClient } from "@microsoft/sp-http";

export interface TodosProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}