import * as React from "react";
import { 
    useState, 
    useEffect 
} from "react";
import { 
    Dropdown, 
    IDropdownOption
 } from '@fluentui/react/lib/Dropdown';
import { 
    PeoplePicker, 
    PrincipalType 
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
import {fetchProjectTypes} from '../services/SPService'
import { IOptions } from "../Models";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react";
//import { IOptions } from "../Models";
import styles from "../ProjectPortal.module.scss";

const NewProject: React.FC<INewProjectProps> = (props) =>{

    const [titleValue, setTitleValue] = useState<string>('');
    const [optValue, setOptValue] = useState<string>('');
    const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
    const [projectManager, setProjectManager] = useState([]);
    const [responsibleManager, setResponsibleManager] = useState([]);
    const [projectMembers, setprojectMembers] = useState([]);
    
    const _getProjectManager = (items: any[]): void => {
        setProjectManager(items);
    }
    const _getResponsibleManager = (items: any[]): void => {
        setResponsibleManager(items);
    }
    const _getProjectMembers = (items: any[]): void => {
        setprojectMembers(items);
    }
    const _onOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
        setOptValue(option.text);
    }
    const onTitleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
        setTitleValue(newValue);
    }

    useEffect(() => {
        fetchProjectTypes(props.siteAbsolutetUrl).then((data: IOptions[]) => {
            const dropDownOptions = data.map(x => ({
                key: x.Id,
                text: x.Title
              }));
            setDropdownOptions(dropDownOptions);
          })
          .catch((error) => {
            console.error('Error while fetching data:', error);
          });
    },[]);
    useEffect(() =>{
        setTitleValue(props.context.pageContext.user.displayName);
    });
  

    console.log(titleValue);    
    console.log(dropdownOptions);   
    console.log(projectManager);
    console.log(responsibleManager);
    console.log(projectMembers);
    console.log(optValue);

    return (
    <React.Fragment>
            <TextField 
            label="Rubrik"
            // errorMessage="Error message" 
            required={true}
            onChange={ onTitleTextFieldChange }
             />
               <Dropdown
                 placeholder="välj projekttyp"
                label="Projekttyp"
                options={ dropdownOptions }
                onChange={_onOptionsChange}
                required={true}
               // onChange={dropdownOpt}
            />
            <PeoplePicker
              context={props.context}
              titleText="Projektledare"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
              onChange={ _getProjectManager }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
             <PeoplePicker
              context={props.context}
              titleText="Projektansvarig"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
              onChange={ _getResponsibleManager }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
             <PeoplePicker
              context={props.context}
              titleText="Projektmedlemmar"
              personSelectionLimit={10}
              //showtooltip={true}
              required={true}
              onChange={ _getProjectMembers }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
             <div className={styles.buttonWrapper}>
                <PrimaryButton 
                text="Skapa projekt"
                />
                <DefaultButton
                text="test"
                />
             </div>
    </React.Fragment>)




}

export default NewProject;