import {
    SPHttpClient, 
    SPHttpClientResponse,
    ISPHttpClientOptions, 
   } from '@microsoft/sp-http';
import { IOptions, IProject } from '../Models';
import { WebPartContext } from '@microsoft/sp-webpart-base';
const PROJECT_LIST_API_ENDPOINT: string = `/_api/web/lists/GetByTitle('Projekt')`;
const PROJECTTYPE_LIST_API_ENDPOINT: string = `/_api/web/lists/GetByTitle('ProjektTyp')`;


   export class ProjectService {
    public context: WebPartContext;
    private _siteUrl: string;
    private _spHttpClient: SPHttpClient;
    private _spHttpOptions: any = {
        getMetaData: <ISPHttpClientOptions>{
            headers: {
                'ACCEPT': 'application/json; odata.metadata=full'
            }
        },
        getNoMetaData: <ISPHttpClientOptions>{
            headers: {
                'ACCEPT': 'application/json; odata.metadata=none'
            }
        },
        updateNoMetaData: <ISPHttpClientOptions>{
            headers: {
                'ACCEPT': 'application/json; odata.metadata=none',
                'CONTENT-TYPE': 'application/json',
                'X-HTTP-METHOD': 'MERGE'
            }
        },
        postVerboseMetaData: <ISPHttpClientOptions>{
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-type': 'application/json;odata=verbose'
            }
        },
        postNoMetaData: <ISPHttpClientOptions>{
            headers: {
                'ACCEPT': 'application/json;odata.metadata=none',
                'CONTENT-TYPE': 'application/json',
            }
        }
    };

    constructor(context: WebPartContext) {
        this.context = context;
        this._siteUrl = this.context.pageContext.web.absoluteUrl;
        this._spHttpClient = this.context.spHttpClient;
        
      }

    public getcurrentUserProject(): Promise<any>{
        const promise: Promise<any> = new Promise<any>((resolve, reject)=>{
            const selectQuery = `$select=Id,Title,ProjectManager/Title,ProjectMembers/Title,ProjectMembers/ID,ProjectManager/ID,ProjectLeader/Title,ProjectLeader/ID,absoluteSiteUrl`;
            const expand = `&$expand=ProjectManager,ProjectLeader,ProjectMembers`;
            const orderBy = `&orderBy='Modified'`;

            this._spHttpClient.get(`${this._siteUrl}${PROJECT_LIST_API_ENDPOINT}/items?${selectQuery}${expand}${orderBy}`,
            // this.client.get(`https://karriarkonsulten.sharepoint.com/${LIST_API_ENDPOINT}/items?$select=Kontor`,
            SPHttpClient.configurations.v1,
            this._spHttpOptions.getMetaData).then((respone: SPHttpClientResponse): Promise<any> =>{
            return respone.json();
            }).then((item: any) =>{
            resolve(item.value);
            }).catch((error) =>{
            reject(error);
            });
        }); 
        return promise;
    }
      public async getAllActivities(projects: any): Promise<any>{

        const promise: Promise<any> =  new  Promise<any>((resolve, reject) =>{
            if(projects )
            projects.map((project: any) =>{
                const listsUrl = `${project.AbsoluteSiteUrl}/_api/web/lists/getbytitle('Todos')/items?$select=*,ContentType/Name&$expand=ContentType`;
                this._spHttpClient.get(`${listsUrl}`,
                // this.client.get(`https://karriarkonsulten.sharepoint.com/${LIST_API_ENDPOINT}/items?$select=Kontor`,
                SPHttpClient.configurations.v1,
                this._spHttpOptions.getMetaData).then((respone: SPHttpClientResponse): Promise<any> =>{
                return respone.json();
                }).then((item: any) =>{
                resolve(item.value);
                }).catch((error) =>{
                reject(error);
                });
            })
            return promise;
        });
        

    }
    public getProjectTypeOptions():Promise<IOptions[]>{ 
        const promise: Promise<IOptions[]> = new Promise<IOptions[]>((resolve, reject)=>{       
            const selectQuery = '?$select=Title,Id';
            this._spHttpClient.get(`${this._siteUrl}${PROJECTTYPE_LIST_API_ENDPOINT}/items${selectQuery}`,
            SPHttpClient.configurations.v1,
            this._spHttpOptions.getMetaData
            ).then((respone: SPHttpClientResponse): Promise<{value: IOptions[]}> =>{
            return respone.json();}).then((response: { value: IOptions[]}) =>{
                console.log(response.value);
            resolve(response.value);    
            }).catch((error) =>{reject(error);
          });
        });
        return promise;
    }


    private getItemEntityType(): Promise<string> {
        const promise: Promise<string> = new Promise<string>((resolve, reject) => {
            this._spHttpClient.get(`${this._siteUrl}${PROJECT_LIST_API_ENDPOINT}?$select=ListItemEntityTypeFullName`,
                SPHttpClient.configurations.v1,
                this._spHttpOptions.getNoMetaData
            )
                .then((response: SPHttpClientResponse): Promise<{ ListItemEntityTypeFullName: string }> => {
                    return response.json();
                })
                .then((response: { ListItemEntityTypeFullName: string }): void => {
                    resolve(response.ListItemEntityTypeFullName);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
        return promise;
    }

    public async createProject(newItem: any): Promise<IProject>{
        const oDataType = await this.getItemEntityType();
        const promise: Promise<IProject> = new Promise<IProject>((resolve, reject) => {
            const requestDetails: any = this._spHttpOptions.postNoMetaData;
            newItem['@odata.type'] = oDataType;
            const queryUrl: string = `${this._siteUrl}${PROJECT_LIST_API_ENDPOINT}/items`;
            requestDetails.body = JSON.stringify(
                newItem
            );
            this._spHttpClient.post(
                queryUrl,
                SPHttpClient.configurations.v1,
                requestDetails
            ).then((response: SPHttpClientResponse): Promise<{value: IProject}> => {
                return response.json();
            }).then((response: { value: IProject}) => {
                    resolve(response.value);
                }).catch((e) => {
                    reject(e);
                });
        });
        return promise;
    }
}