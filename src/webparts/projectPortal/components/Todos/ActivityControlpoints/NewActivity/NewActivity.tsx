import * as React from 'react';
import { INewTodoProps } from './INewTodoProps';
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
 import "@pnp/sp/fields";
 import { Web } from "@pnp/sp/webs";  
 import { spfi, SPFx } from "@pnp/sp";
 import { IItemAddResult } from "@pnp/sp/items";
 import styles from "../../../ProjectPortal.module.scss";
 import { TextField } from '@fluentui/react/lib/TextField';
 import { 
  PrimaryButton, 
  Label,
  DatePicker
 } from "office-ui-fabric-react";
import { IProject, IUser } from '../../../Models';
import { IActivity, IContentType } from '../../../Models/IActivity';



const NewActivity: React.FC<INewTodoProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));

   const [titleValue, setTitleValue] = useState<string>('');   
   const [descValue, setdescValue] = useState<string>('');  
   const [selectedDateValue, setSelectedDateValue] = useState<Date>(null);
   const [selectedProjectWebUrl, setSelectedProjectWebUrl] = useState<string>('');
  // const [selectedProjectContentTypeId, setSelectedProjectContentTypeId] = useState<string>('');
  // const [absoluteSiteUrl: setAbsoluteSiteUrl] = useState<string>('');
//   const [priceValue, setPriceValue] = useState<string>(''); 
   const [projectOptionsValue, setProjectOptionsValue] = useState<any>(null);
  // const [activityOptionsValue, setActivityOptionsValue] = useState<any>(null);
   const [options, setOptions] = useState<IDropdownOption[]>([]);
   //const [activityOptions, setActivityOptions] = useState<IDropdownOption[]>([]);


   const [manager, setManager] = useState([]);
   const _getManager= (props: IUser[]): void => {  setManager(props);}

   const _onProjectOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: any, index?: number): void => {
    setProjectOptionsValue(option.key);
    setSelectedProjectWebUrl(option.webUrl);
    
  }

   const _onTitleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
    setTitleValue(newValue);
  }
  const _onDescTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
    setdescValue(newValue);
  }
  const _onDateChange = (date: Date | null | undefined):void => {
    setSelectedDateValue(date);
  }

  const onSaveActivty = async (): Promise<any>  => {
    const web = Web(selectedProjectWebUrl).using(SPFx(props.context));
    const selectedManager = manager.map((items: IUser) =>{return items.Id})[0];
    const selectedUser = await web.ensureUser(selectedManager);
    const contentTypes : IContentType[]  = await web.lists.getByTitle("Activities").items.select('ContentType/Id,ContentType/Name').expand('ContentType').getAll();
    const contentType = contentTypes.find(contentType => 
      contentType.ContentType.Name === 'Activity'
    );
    //const contentTypeId = selectedProjectContentTypeId;
    const activities: IActivity = {
        ContentTypeId: contentType.ContentType.Id.StringValue,
        Title: titleValue,
        ResponsibleId: selectedUser.data.Id,
        Description: descValue,
        DueDate1: selectedDateValue,
   
    }
    try{
         const web = Web(selectedProjectWebUrl).using(SPFx(props.context));
         const iar: IItemAddResult = await web.lists.getByTitle("Activities").items.add(activities);
         setTitleValue('');
         setdescValue('');
         setSelectedDateValue(null);
         setProjectOptionsValue(null);
         setManager([]);
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
      })).filter(item => 
        item.ProjectLeader.ID === currentUser.Id || 
        item.ProjectManager.ID === currentUser.Id || 
        item.ProjectMembers.some((member: any) => member.ID === currentUser.Id)
       );
       // const webUrl = items.filter(item => item.absoluteSiteUrl);  
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
                Registrera en aktivitet.</Label>
            </div>
            <div className={styles.newProjectHeaderText}>
                <Label
                style={{fontSize:18, fontWeight: 400}}
                >
                Använd formuläret nedan för att registrera en aktivitet för projektet som du är medlem i eller ansvarig för.
                </Label>
            </div>
        </div>
        <div className={styles.newProjectForm}>
         <Dropdown
            placeholder="Välj projekt"
            label="Projekt"
            options={ options }
            onChange={ _onProjectOptionsChange }
            required={true}
            selectedKey={projectOptionsValue}
            // onChange={dropdownOpt}
          />
          <TextField 
            label="Rubrik"
            // errorMessage="Error message" 
            required={true}
            value={titleValue}
            onChange={ _onTitleTextFieldChange }
            />
          <TextField 
            label="Beskrivning"
            multiline={true}
            rows={6}
            required={true}
            value={descValue}
            onChange={ _onDescTextFieldChange } 
          />
            <DatePicker 
               label="Förfallodatum"
               value={selectedDateValue}
               onSelectDate={ _onDateChange } 
             />
        <PeoplePicker
              context={props.context}
              titleText="Ansvarig"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
              onChange={ _getManager }
              defaultSelectedUsers={manager}
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
            <div className={styles.buttonWrapper}>
                <PrimaryButton 
                text="Skapa aktivtet"
                disabled={
                !titleValue || 
                !descValue || 
                !manager.map((items: IUser) =>{return items.Id})[0]  ||
                !selectedDateValue 
            }
                onClick={ onSaveActivty }
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



export default NewActivity;