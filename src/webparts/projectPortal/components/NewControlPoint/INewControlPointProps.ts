import { SPHttpClient } from "@microsoft/sp-http";

export interface INewControlPointProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}