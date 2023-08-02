// import {
//     SPHttpClient, 
//     SPHttpClientResponse,
//     ISPHttpClientOptions, 
//    } from '@microsoft/sp-http';
// //import { IDropDownOption } from '../Models';
// const LIST_API_ENDPOINT: string = `/_api/web/lists/GetByTitle('Projekt')`;


//    export class ProjectService {
//     private _spHttpOptions: any = {
//         getNoMetaData: <ISPHttpClientOptions>{
//             headers: {
//             'ACCEPT': 'application/json; odata.metadata=none'}},
//         getMetaData: <ISPHttpClientOptions>{
//             headers: {
//             'ACCEPT': 'application/json'}},
//         postNoMetadata: <ISPHttpClientOptions>{ 
//             headers: {
//             'ACCEPT': 'application/json; odata.metadata=none',
//             'CONTENT-TYPE': 'application/json'}},
//         updateNoMetadata: <ISPHttpClientOptions>{
//             headers: {
//             'ACCEPT': 'application/json; odata.metadata=none',
//             'CONTENT-TYPE': 'application/json',
//             'X-HTTP-Method': 'PATCH'
//             }
//         }
//     };  
//     constructor(private siteUrl: string, private client: SPHttpClient) {
//     }
//     // public getdropDownOptions():Promise<IDropDownOption[]>{ 
//     //     const promise: Promise<IDropDownOption[]> = new Promise<IDropDownOption[]>((resolve, reject)=>{     
//     //         const selectQuery = `Projekttyp`;    
//     //         this.client.get(`${this.siteUrl}${LIST_API_ENDPOINT}/fields?$filter=EntityPropertyName eq '${selectQuery}'`,
//     //         SPHttpClient.configurations.v1,
//     //         this._spHttpOptions.getMetaData
//     //         ).then((respone: SPHttpClientResponse): Promise<{value: IDropDownOption[]}> =>{
//     //         return respone.json();}).then((response: { value: IDropDownOption[]}) =>{
//     //             console.log(response.value);
//     //         resolve(response.value);    
//     //         }).catch((error) =>{reject(error);
//     //       });
//     //     });
//     //     return promise;
//     // }
// }