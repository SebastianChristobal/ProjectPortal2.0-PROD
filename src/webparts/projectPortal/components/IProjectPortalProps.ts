import { SPHttpClient } from "@microsoft/sp-http";


export interface IProjectPortalProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  siteAbsolutetUrl: string;
  SPHttpClient: SPHttpClient;
  context:any;

}
