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
import { Image, IImageProps, ImageFit } from '@fluentui/react/lib/Image';
import { IItemAddResult } from "@pnp/sp/items";
import { spfi, SPFx } from "@pnp/sp";
import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
//import { IOptions } from "../Models";
import { 
    PrimaryButton,
    Label 
} from "office-ui-fabric-react";
import styles from "../../ProjectPortal.module.scss";
import { IProject, IUser } from "../../Models";

const imageProps: Partial<IImageProps> = {
    src: 'https://braverodev.sharepoint.com/sites/Projektportalen2.0/StartPageImage/msTeams.png',
    // Show a border around the image (just for demonstration purposes)
    imageFit: ImageFit.contain,
    width: '100%',
    height: 285,
    styles: props => ({ root: { 
       // border: '1px solid ' + props.theme.palette.neutralSecondary,
        marginTop: '-16px' 
    } }),
  };

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
        const projectManagerUser = projectManager.map((items: IUser) =>{return items.Id})[0];
        const responsibleManagerUser = responsibleManager.map((items: IUser) =>{return items.Id})[0];
        const projectMembersUser: number[] = [];
        projectMembers.map( async (items: IUser) => {
            const selectedProjectMembers = await sp.web.ensureUser(items.Id);
            projectMembersUser.push(selectedProjectMembers.data.Id); // Push the Id into the array
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
             const iar: IItemAddResult = await sp.web.lists.getByTitle("Projekt").items.add(project);
             setTitleValue('');
             setCustomerValue('');
             setOptValue(null);
             setProjectManager([]);
             setResponsibleManager([]);
             setprojectMembers([]);
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
            value={titleValue}
            onChange={ _onTitleTextFieldChange }
             />
             <TextField 
               label="Kund"
               required={true}
               value={customerValue}
               onChange={ _onCustomerTextFieldChange } 
             />
               <Dropdown
                 placeholder="välj projekttyp"
                label="Projekttyp"
                options={ dropdownOptions }
                selectedKey={optValue}
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
              defaultSelectedUsers={projectManager}
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
              defaultSelectedUsers={responsibleManager}
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
              defaultSelectedUsers={projectMembers}
              onChange={ _getProjectMembers }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
             <div className={styles.buttonWrapper}>
                <PrimaryButton 
                text="Skapa projekt"
                disabled={
                    !titleValue ||
                    !customerValue ||
                    !optValue ||
                    !projectManager.map((items: IUser) =>{return items.Id})[0] ||
                    !responsibleManager.map((items: IUser) =>{return items.Id})[0] ||
                    !projectMembers.map((items: IUser) =>{return items.Id})[0]
                }
                onClick={ onSaveProject}
                />
             </div>
        </div>
        <div className={styles.newProjectInfoText}>
        <Image
        width={100}
        height={100}
         {...imageProps} 
         alt="Example with no image fit value and no height or width is specified." />
            <Label
             style={{fontSize:18, fontWeight: 400}}
            >
           Lorem ipsum, consectetuer di adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.
            </Label>
        </div>
    </div>
    </React.Fragment>)
}

export default NewProject;