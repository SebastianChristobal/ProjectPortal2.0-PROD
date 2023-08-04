import { SPHttpClient } from "@microsoft/sp-http";

export interface IMyProjectsProps {
    SPHttpClient?: SPHttpClient;
    siteAbsolutetUrl?: string;
    context?: any;
}