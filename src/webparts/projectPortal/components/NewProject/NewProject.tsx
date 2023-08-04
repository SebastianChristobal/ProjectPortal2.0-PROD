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
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";  
import { spfi, SPFx } from "@pnp/sp";
import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
//import { IOptions } from "../Models";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import styles from "../ProjectPortal.module.scss";
import { ProjectService } from '../services/';
import { IProject, IUser } from "../Models";

const NewProject: React.FC<INewProjectProps> = (props) =>{
    const _projectService = new ProjectService(props.siteAbsolutetUrl, props.SPHttpClient);
    const sp = spfi().using(SPFx(props.context));
    
    const [titleValue, setTitleValue] = useState<string>('');   
    const [customerValue, setCustomerValue] = useState<string>('');  
    const [optValue, setOptValue] = useState<any>(null);
    const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
    const [projectManager, setProjectManager] = useState([]);
    const [responsibleManager, setResponsibleManager] = useState([]);
    const [projectMembers, setprojectMembers] = useState([]);
    
    const _getProjectManager = (props: IUser[]): void => {  setProjectManager(props);}
    const _getResponsibleManager = (props: IUser[]): void => {  setResponsibleManager(props);}
    const _getProjectMembers = (props: IUser[]): void => {  setprojectMembers(props);}
    
    const _onOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
        setOptValue(option.key);
    }
    const _onTitleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
        setTitleValue(newValue);
    }
    const _onCustomerTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
        setCustomerValue(newValue);
    }

    const onSaveProject = async (): Promise<any>  => {
        const projectManagerUser = projectManager.map((items: IUser) =>{return items.id})[0];
        const responsibleManagerUser = responsibleManager.map((items: IUser) =>{return items.id})[0];
        const projectMembersUser: number[] = [];
        projectMembers.map( async (items: IUser) => {
            const selectedProjectManager = await sp.web.ensureUser(items.id);
            projectMembersUser.push(selectedProjectManager.data.Id); // Push the Id into the array
        });
        const selectedProjectManager = await sp.web.ensureUser(projectManagerUser);
        const selectedResponsibleManager = await sp.web.ensureUser(responsibleManagerUser);
       
        const project: IProject = {
            Title: titleValue,
            Customer: customerValue,
            ProjectTypeId: optValue,
            ProjectLeaderId: selectedProjectManager.data.Id,
            ProjectManagerId: selectedResponsibleManager.data.Id,
            ProjectMembersId: projectMembersUser
        }
        try{
             await _projectService.createProject(project).then(() => {console.log('success');});
            }
        catch(error){
            console.error(error);
            }
    }
    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try {
                const items = await sp.web.lists.getByTitle("ProjektTyp").items();
                const dropdownOptions = items.map((option: any) => ({
                    key: option.Id,
                    text: option.Title
                }));
                setDropdownOptions(dropdownOptions);
                }
                catch (error) {
                    console.error(error);
                }
        };

        fetchData().catch((err) => {
            console.error(err);
        });
    }, []); 

    return (
    <React.Fragment>
            <TextField 
            label="Rubrik"
            // errorMessage="Error message" 
            required={true}
            onChange={ _onTitleTextFieldChange }
             />
             <TextField 
               label="Kund"
               required={true}
               onChange={ _onCustomerTextFieldChange } 
             />
               <Dropdown
                 placeholder="välj projekttyp"
                label="Projekttyp"
                options={ dropdownOptions }
                onChange={ _onOptionsChange }
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
                onClick={ onSaveProject}
                />
                <DefaultButton
                text="Avbryt"
                />
             </div>
    </React.Fragment>)
}

export default NewProject;