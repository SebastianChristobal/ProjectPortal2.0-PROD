import { SPHttpClient } from "@microsoft/sp-http";

export interface INewProjectProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}