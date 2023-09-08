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
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);

const _onOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
  setOptValue(option.key);
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
      ProjektId: optValue,
      Extent: extentValue,
      Price: priceValue
  }
  try{
       const iar: IItemAddResult = await sp.web.lists.getByTitle("ATA").items.add(ata)
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

useEffect(() => {
  const fetchProjectsAsOptions = async (): Promise<any> => {
      try {
          const items = await sp.web.lists.getByTitle("Projekt").items();
          const dropdownOptions = items.map((project: IProject) => ({
              key: project.Id,
              text: project.Title
          }));
          setDropdownOptions(dropdownOptions);
          }
          catch (error) {
              console.error(error);
          }
  };
  fetchProjectsAsOptions().catch((err) => {
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
            options={ dropdownOptions }
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
                disabled={!titleValue || !customerValue || !extentValue || !priceValue || !optValue || !dropdownOptions }
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