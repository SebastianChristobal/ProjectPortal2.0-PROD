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
import { IItemAddResult } from "@pnp/sp/items";
import { spfi, SPFx } from "@pnp/sp";
import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
//import { IOptions } from "../Models";
import { PrimaryButton, DefaultButton, Label } from "office-ui-fabric-react";
import styles from "../ProjectPortal.module.scss";
import { IProject, IUser } from "../Models";

const NewProject: React.FC<INewProjectProps> = (props) =>{
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
             const iar: IItemAddResult = await sp.web.lists.getByTitle("Projekt").items.add(project)
             console.log(iar);
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
    <div className={styles.newProjectWrapper}>
        <div className={styles.newProjectTopNav}>
            <div>
                <Label
                style={{fontSize:24, fontWeight: 600}}
                >
                Registrera ett nytt projekt</Label>
            </div>
            <div className={styles.newProjectHeaderText}>
                <Label
                style={{fontSize:18, fontWeight: 400}}
                >
                Använd formuläret nedan för att registrera ett nytt projekt.
                När projektregistreringen har godkänts kommer projektet automatiskt registreras 
                i projektportföljen och ett Microsoft Teams team samt tillhörande SharePoint webbplats skapas upp.
                Den angivna projektledaren samt projektägaren för projektet kommer få ett mail med information om att projektet är skapat och kommer även läggas in som ägare av teamet.</Label>
            </div>
        </div>
        <div className={styles.newProjectForm}>
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
        </div>
        <div className={styles.newProjectInfoText}>
            <Label
             style={{fontSize:18, fontWeight: 400}}
            >
            När ett projekt registreras ombeds du välja Sekretessnivå. Val av sekretessnivå styr behörighet att se projektet i projektportföljen samt behörighetsnivå på SharePoint webbplatsen och teamet som skapas för projektet. 
            Standard - Alla användare kan se projektet i projektportföljen samt komma åt och läsa allt på SharePoint webbplatsen. Endast projektdeltagare (användare som är tillagda i det aktuella teamet) får tillgång till teamet.
            Nedlåst - Projektet är synligt för alla användare i projektportföljen men inga, förutom projektdeltagare (ägare och medlemmar i teamet) kommer åt SharePoint webbplatsen samt har tillgång till teamet.
            Konfidentiellt - Projektet är dolt för alla användare i projektportföljen (syns endast för medlemmar i SharePoint gruppen "Konfidentiella projekt"), projektdeltagare (användare som läggs till i teamet) kommer åt teamet och SharePoint webbplatsen.
            </Label>
        </div>
    </div>
    </React.Fragment>)
}

export default NewProject;