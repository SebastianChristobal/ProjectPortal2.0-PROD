import * as React from 'react';
import { INewActivityProps } from './INewActivtyProps';
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
 import { IItemAddResult } from "@pnp/sp/items";
 import { spfi, SPFx } from "@pnp/sp";
 import styles from "../ProjectPortal.module.scss";
 import { TextField } from '@fluentui/react/lib/TextField';
 import { 
  PrimaryButton, 
  Label,
  DatePicker
 } from "office-ui-fabric-react";
import { IProject, IUser } from '../Models';
import { IActivity } from '../Models/IActivity';



const NewActivity: React.FC<INewActivityProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));

   const [titleValue, setTitleValue] = useState<string>('');   
   const [descValue, setdescValue] = useState<string>('');  
   const [selectedDateValue, setSelectedDateValue] = useState<Date>(null);
//   const [priceValue, setPriceValue] = useState<string>(''); 
   const [projectOptionsValue, setProjectOptionsValue] = useState<any>(null);
   const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
   const [manager, setManager] = useState([]);
   const _getManager= (props: IUser[]): void => {  setManager(props);}

   const _onProjectOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    setProjectOptionsValue(option.key);
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
    const selectedManager = manager.map((items: IUser) =>{return items.id})[0];
    const selectedUser = await sp.web.ensureUser(selectedManager);
    const activities: IActivity = {
        Title: titleValue,
        ResponsibleId: selectedUser.data.Id,
        ProjektId: projectOptionsValue,
        Description: descValue,
        DueDate: selectedDateValue,
    }
    try{
         const iar: IItemAddResult = await sp.web.lists.getByTitle("Activity").items.add(activities);
         console.log(iar);
        }
    catch(error){
        console.error(error);
        } 
        // setTitleValue('');
        // setDescriptionValue('');
        // setProjectOptionsValue(null);
        // setSelectedDateValue(null);
        // setOptControlTypeValue(null);
        // setImplementedBy(null);
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
            options={ dropdownOptions }
            onChange={ _onProjectOptionsChange }
            required={true}
            // onChange={dropdownOpt}
          />
          <TextField 
            label="Rubrik"
            // errorMessage="Error message" 
            required={true}
            onChange={ _onTitleTextFieldChange }
            />
          <TextField 
            label="Beskrivning"
            multiline={true}
            rows={6}
            required={true}
            onChange={ _onDescTextFieldChange } 
          />
            <DatePicker 
               label="Förfallodatum"
               onSelectDate={ _onDateChange } 
             />
        <PeoplePicker
              context={props.context}
              titleText="Ansvarig"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
              onChange={ _getManager }
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
                !manager.map((items: IUser) =>{return items.id})[0]  ||
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