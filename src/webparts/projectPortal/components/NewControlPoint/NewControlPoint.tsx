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
import "@pnp/sp/fields";
 import { IItemAddResult } from "@pnp/sp/items";
 import { spfi, SPFx } from "@pnp/sp";
// import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
//import { IOptions } from "../Models";
import { 
  PrimaryButton, 
  Label
 } from "office-ui-fabric-react";
import { INewControlPointProps } from "./INewControlPointProps";
//import { IField, IFieldInfo } from "@pnp/sp/fields/types";
import styles from "../ProjectPortal.module.scss";
import { IControlPoints } from "../Models/IControlPoints";
import { IProject } from "../Models";

const NewControlPoint: React.FC<INewControlPointProps> = (props) =>{
  const sp = spfi().using(SPFx(props.context));

  const [titleValue, setTitleValue] = useState<string>('');   
  const [customerValue, setCustomerValue] = useState<string>('');  
  const [extentValue, setExtentValue] = useState<string>('');  
  const [priceValue, setPriceValue] = useState<string>(''); 
  const [optValue, setOptValue] = useState<any>(null);
  const [optControlTypeValue, setOptControlTypeValue] = useState<any>(null);
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
  const [controlTypeOptions, setControlTypeOptions] = useState<IDropdownOption[]>([]);


const _onOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    setOptValue(option.key);
}
const _onControlTypeOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    setOptControlTypeValue(option.key);
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

const onSaveControlPoint = async (): Promise<any>  => {
  const ata: IControlPoints = {
      Title: titleValue,
  }
  try{
       const iar: IItemAddResult = await sp.web.lists.getByTitle("Control").items.add(ata)
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

useEffect(() => {
    const options : IDropdownOption[] = [{ key: 'Kvalitetskontroll', text: 'Kvalitetskontroll'   }, {  key: 'Brandskyddskontroll', text: 'Brandskyddskontroll'}]
    setControlTypeOptions(options)
    // const fetchProjectsData = async (): Promise<any> => {
    //     try {
    //         const items = await sp.web.lists.getByTitle("Projekt").items();
    //         const dropdownOptions = items.map((project: IProject) => ({
    //             key: project.Id,
    //             text: project.Title
    //         }));
    //         setDropdownOptions(dropdownOptions);
    //         }
    //         catch (error) {
    //             console.error(error);
    //         }
    // };
  
    // fetchProjectsData().catch((err) => {
    //     console.error(err);
    // });
  }, []); 

console.log(optValue);
console.log(dropdownOptions);
console.log(titleValue);
console.log(customerValue);
console.log(extentValue);
console.log(priceValue);
console.log(optControlTypeValue);

  return(<React.Fragment>
    <div className={styles.newProjectWrapper}>
        <div className={styles.newProjectTopNav}>
            <div>
                <Label
                style={{fontSize:24, fontWeight: 600}}
                >
                Registrera genomförd kontroll.</Label>
            </div>
            <div className={styles.newProjectHeaderText}>
                <Label
                style={{fontSize:18, fontWeight: 400}}
                >
                Använd formuläret nedan för att registrera en genomförd kontrollpunkt.
                </Label>
            </div>
        </div>
        <div className={styles.newProjectForm}>
        <Dropdown
                 placeholder="Välj projekt"
                label="Projekt"
                options={ dropdownOptions }
                 onChange={ _onOptionsChange }
                required={true}
               // onChange={dropdownOpt}
            />
            <TextField 
             label="Rubrik"
             // errorMessage="Error message" 
             required={true}
             onChange={ _onTitleTextFieldChange }
             />
               <Dropdown
                 placeholder="Välj kontrolltyp"
                label="Kontrolltyp"
                options={ controlTypeOptions }
                 onChange={ _onControlTypeOptionsChange }
                required={true}
               // onChange={dropdownOpt}
            />
             <TextField 
               label="Beskrivning"
               required={true}
               multiline={true}
               rows={6}
               onChange={ _onCustomerTextFieldChange }  
             />
              <TextField 
               label="Omfattning"
               required={true}
               onChange={ _onExtentTextFieldChange } 
             />
              <TextField 
               label="Ungefärlig prisuppgift i SEK"
               required={true}
               onChange={ _onPriceTextFieldChange } 
             />
             <div className={styles.buttonWrapper}>
                <PrimaryButton 
                disabled={!titleValue || !customerValue || !extentValue || !priceValue || !optValue || !dropdownOptions || !optControlTypeValue }
                text="Skapa genomförd kontroll"
                onClick={ onSaveControlPoint}
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



export default NewControlPoint;