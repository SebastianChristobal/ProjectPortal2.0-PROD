import * as React from "react";
import { 
    useState, 
    useEffect 
} from "react";
import { 
    Dropdown, 
    IDropdownOption
 } from '@fluentui/react/lib/Dropdown';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";  
import { Web } from "@pnp/sp/webs";  
 import { IItemAddResult } from "@pnp/sp/items";
 import { spfi, SPFx } from "@pnp/sp";
// import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
//import { IOptions } from "../Models";
import { 
  PrimaryButton, 
  Label
 } from "office-ui-fabric-react";
import { INewATAProps } from "./INewATAProps";
import styles from "../../../ProjectPortal.module.scss";
import { IProject } from "../../../Models";
import { IATA } from "../../../Models/IATA";

const NewATA: React.FC<INewATAProps> = (props) =>{
  const sp = spfi().using(SPFx(props.context));

  const [titleValue, setTitleValue] = useState<string>('');   
  const [customerValue, setCustomerValue] = useState<string>('');  
  const [extentValue, setExtentValue] = useState<string>('');  
  const [priceValue, setPriceValue] = useState<string>(''); 
  const [optValue, setOptValue] = useState<any>(null);
  const [options, setOptions] = useState<IDropdownOption[]>([]);
  const [selectedProjectWebUrl, setSelectedProjectWebUrl] = useState<string>('');
 const _onOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: any, index?: number): void => {
  setOptValue(option.key);
  setSelectedProjectWebUrl(option.webUrl);
}
const _onTitleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
  setTitleValue(newValue);
  
}
const _onCustomerTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
  setCustomerValue(newValue);
}
const _onExtentTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
  setExtentValue(newValue);
}
const _onPriceTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
  setPriceValue(newValue);
}

const onSaveATA = async (): Promise<any>  => {
  const ata: IATA = {
      Title: titleValue,
      Customer: customerValue,
      Extent: extentValue,
      Price: priceValue
  }
  try{
    const web = Web(selectedProjectWebUrl).using(SPFx(props.context));
       const iar: IItemAddResult = await web.lists.getByTitle("ATA").items.add(ata)
       setTitleValue('');
       setCustomerValue('');
       setExtentValue('');
       setPriceValue('');
       setOptValue(null);
       console.log(iar);
      }
  catch(error){
      console.error(error);
      } 
}
const fetchProjects = async (): Promise<any> => {
  const currentUser = await sp.web.currentUser();
  try {
    const items = await sp.web.lists.getByTitle("Projekt").items.select(
      'Id',    
      'Title', 
      'ProjectType/Title',
      'ProjectType/ID',
      'Customer',
      'ProjectManager/Title',
      'ProjectMembers/Title',
      'ProjectMembers/ID',
      'ProjectManager/ID',
      'ProjectLeader/Title',
      'ProjectLeader/ID',
      'ProjectImage',
      'absoluteSiteUrl',
      'Status',
      'ContentType/Id'
      ).expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers', 'ContentType').orderBy('Modified', true).getAll();
    const myProjects = items.map((projects: any) => ({  
        Id: projects.Id, 
        Title: projects.Title,
        Customer: projects.Customer,
        ProjectLeader: projects.ProjectLeader,
        ProjectManager: projects.ProjectManager,
        ProjectMembers: projects.ProjectMembers,
        ProjectImage: projects.ProjectImage,
        Status: projects.Status,
        ProjectType: projects.ProjectType,
        AbsoluteSiteUrl: projects.absoluteSiteUrl,
        ContentType: projects.ContentType
    })).filter((item: any) => 
      item.ProjectLeader.ID === currentUser.Id || 
      item.ProjectManager.ID === currentUser.Id || 
      item.ProjectMembers.some((member: any) => member.ID === currentUser.Id)
     );
      const options = myProjects.map((project: IProject) => ({
          key: project.Id,
          text: project.Title,
          webUrl: project.AbsoluteSiteUrl
      }));
      setOptions(options);
      }
      catch (error) {
          console.error(error);
      }
};
useEffect(() => {
  fetchProjects().catch((err) => {
      console.error(err);
  });
}, []); 

  return(<React.Fragment>
    <div className={styles.newProjectWrapper}>
        <div className={styles.newProjectTopNav}>
            <div>
                <Label
                style={{fontSize:24, fontWeight: 600}}
                >
                Registrera ÄTA (ändring, tillägg och avgående).</Label>
            </div>
            <div className={styles.newProjectHeaderText}>
                <Label
                style={{fontSize:18, fontWeight: 400}}
                >
                Använd formuläret nedan för att registrera en ändring, tillägg och avgående.
                </Label>
            </div>
        </div>
        <div className={styles.newProjectForm}>
         <Dropdown
            placeholder="Välj projekt"
            label="Projekt"
            options={ options }
            onChange={ _onOptionsChange }
            selectedKey={optValue}
            required={true}
          />
          <TextField 
            label="Rubrik"
            // errorMessage="Error message" 
            required={true}
            value={titleValue}
            onChange={ _onTitleTextFieldChange }
            />
          <TextField 
            label="Beställare"
            required={true}
            value={customerValue}
            onChange={ _onCustomerTextFieldChange } 
          />
          <TextField 
            label="Omfattning"
            required={true}
            value={extentValue}
            onChange={ _onExtentTextFieldChange } 
          />
          <TextField 
            label="Ungefärlig prisuppgift i SEK"
            required={true}
            value={priceValue}
            onChange={ _onPriceTextFieldChange } 
          />
            <div className={styles.buttonWrapper}>
                <PrimaryButton 
                text="Skapa ÄTA"
                disabled={!titleValue || !customerValue || !extentValue || !priceValue || !optValue || !options }
                onClick={ onSaveATA }
                />
             </div>
        </div>
        <div className={styles.newProjectInfoText}>
            <Label
             style={{fontSize:18, fontWeight: 400}}
            >
           Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.
            </Label>
        </div>
    </div>
    </React.Fragment>)
}

export default NewATA;