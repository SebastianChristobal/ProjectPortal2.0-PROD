import { SPHttpClient } from "@microsoft/sp-http";

export interface IControlPointsProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
}