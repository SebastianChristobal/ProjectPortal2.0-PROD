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
import "@pnp/sp/fields";
// import { IItem } from "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/attachments";
import { IItemAddResult } from "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";  
 import { spfi, SPFx } from "@pnp/sp";
import { TextField } from '@fluentui/react/lib/TextField';
import { 
  PrimaryButton, 
  Label,
  DatePicker
 } from "office-ui-fabric-react";
//  import { FileAddResult } from '@pnp/sp/files';
// import { Web } from '@pnp/sp/webs';
// import { spSetup } from '@pnp/sp-clientsvc';
import { INewControlPointProps } from "./INewControlPointProps";
import styles from "../../../ProjectPortal.module.scss";
import { IControlPoints } from "../../../Models/IControlPoints";
import { IProject, IUser } from "../../../Models";
import { IContentType } from "../../../Models/IActivity";

const NewControlPoint: React.FC<INewControlPointProps> = (props) =>{
  const sp = spfi().using(SPFx(props.context));

  const [titleValue, setTitleValue] = useState<string>('');   
  const [descriptionValue, setDescriptionValue] = useState<string>('');  
  const [projectOptionsValue, setProjectOptionsValue] = useState<any>(null);
  const [selectedDateValue, setSelectedDateValue] = useState<Date>(null);
  const [optControlTypeValue, setOptControlTypeValue] = useState<any>(null);
  const [optControlTypeKey, setOptControlTypeKey] = useState<any>(null);
  const [selectedProjectWebUrl, setSelectedProjectWebUrl] = useState<string>('');
  const [options, setOptions] = useState<IDropdownOption[]>([]);
  const [controlTypeOptions, setControlTypeOptions] = useState<IDropdownOption[]>([]);
  const [implementedBy, setImplementedBy] = useState([]);
   const [selectedFiles, setSelectedFiles] = useState([]);
  const _getImplementedBy = (props: IUser[]): void => {  setImplementedBy(props);}

const _onProjectOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: any, index?: number): void => {
  setProjectOptionsValue(option.key);
  setSelectedProjectWebUrl(option.webUrl);
}
const _onControlTypeOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    setOptControlTypeValue(option.text);
    setOptControlTypeKey(option.key)
}
const _onTitleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
  setTitleValue(newValue);
}
const _onDescTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
  setDescriptionValue(newValue);
}
const _onDateChange = (date: Date | null | undefined):void => {
  setSelectedDateValue(date);
}
const handleFileChange = (event: any): void => {
  setSelectedFiles([...event.target.files]);
};

// const handleUpload = () => {
//   if (selectedFiles.length > 0) {
//     uploadFiles(selectedFiles);
//   }
// };

// const uploadFiles = async (files: any) => {
//   const siteUrl = 'https://your-sharepoint-site-url';
//     sp.setup({
//       sp: {
//         baseUrl: siteUrl,
//       },
//     });
//     spSetup({
//       sp: {
//         baseUrl: siteUrl,
//       },
//     });
//   try {
//     const web = Web(siteUrl);

//     for (const file of files) {
//       const fileAddResult: FileAddResult = await web.getFolderByServerRelativeUrl('/your-library-name')
//         .files.add(file.name, file, true);

//       console.log(`File '${file.name}' uploaded successfully. ID: ${fileAddResult.data.Id}`);
//     }
//   } catch (error) {
//     console.error('Error uploading files:', error);
//   }
// };
const onSaveControlPoint = async (): Promise<any>  => {
  const web = Web(selectedProjectWebUrl).using(SPFx(props.context));
  const implementedByUser = implementedBy.map((items: IUser) =>{return items.id})[0];
  const selectedUser = await sp.web.ensureUser(implementedByUser);
  const contentTypes : IContentType[] = await web.lists.getByTitle("Activities").items.select('ContentType/Id,ContentType/Name').expand('ContentType').getAll();
  console.log(contentTypes);
  console.log(selectedUser);
  const contentType = contentTypes.find(contentType => 
    contentType.ContentType.Name === 'Controlpoint'
  );
  console.log(contentType.ContentType.Id.StringValue);
  const controlPoint: IControlPoints = {
    ContentTypeId: contentType.ContentType.Id.StringValue,
    Title: titleValue,
    Description: descriptionValue,
    ControlType: optControlTypeValue,
    StartDate: selectedDateValue,
    ImplementedById: selectedUser.data.Id
}
  //const contentTypeId = selectedProjectContentTypeId;
  try{
    const web = Web(selectedProjectWebUrl).using(SPFx(props.context));
    const iar: IItemAddResult = await web.lists.getByTitle("Activities").items.add(controlPoint);
   setTitleValue('');
   setDescriptionValue('');
   setProjectOptionsValue(null);
   setSelectedDateValue(null);
   setOptControlTypeKey(null);
   setImplementedBy([]);
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

useEffect(() => {
    const options : IDropdownOption[] = [{ key: '1', text: 'Säkerhetskontroll'   }, {  key: '2', text: 'Kvalitetskontroll'}, {  key: '3', text: 'Brandskyddskontroll'}]
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

  console.log(selectedFiles);
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
                options={ options }
                onChange={ _onProjectOptionsChange }
                required={true}
                defaultValue={projectOptionsValue}
                selectedKey={projectOptionsValue}
               // onChange={dropdownOpt}
            />
            <TextField 
             label="Rubrik"
             // errorMessage="Error message" 
             value={ titleValue }
             required={true}
             onChange={ _onTitleTextFieldChange }
             />
               <Dropdown
                placeholder="Välj kontrolltyp"
                label="Kontrolltyp"
                options={ controlTypeOptions }
                onChange={ _onControlTypeOptionsChange }
                required={true}
                selectedKey={optControlTypeKey}
                defaultValue={projectOptionsValue}
            />
             <TextField 
               label="Beskrivning"
               required={true}
               multiline={true}
               rows={6}
               value={descriptionValue}
               onChange={ _onDescTextFieldChange }  
             />
              <DatePicker 
               label="Datum"
               onSelectDate={ _onDateChange } 
               value={selectedDateValue}
             />
              <PeoplePicker
              context={props.context}
              titleText="Genomförs av"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
              defaultSelectedUsers={implementedBy}
              onChange={ _getImplementedBy }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
               
              resolveDelay={1000} 
             />
              <input type="file" multiple onChange={handleFileChange} />
              <button >Upload Files</button>
             <div className={styles.buttonWrapper}>
                <PrimaryButton 
                disabled={
                  !titleValue || 
                  !descriptionValue || 
                  !projectOptionsValue || 
                  !selectedDateValue || 
                  !optControlTypeValue ||
                  !implementedBy.map((items: IUser) =>{return items.id})[0] 
                }
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