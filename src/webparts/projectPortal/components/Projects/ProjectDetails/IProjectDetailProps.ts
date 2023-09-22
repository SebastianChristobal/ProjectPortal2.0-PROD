import { SPHttpClient } from "@microsoft/sp-http";

export interface IProjectDetailProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any; 
    themeVariant?: any;
}