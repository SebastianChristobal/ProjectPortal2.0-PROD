import { SPHttpClient } from "@microsoft/sp-http";

export interface IAllProjectsProps{
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any;
}