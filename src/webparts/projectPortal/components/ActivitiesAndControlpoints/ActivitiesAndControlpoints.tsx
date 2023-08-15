import * as React from "react";
import { 
    useState, 
    useEffect 
} from "react";
//import styles from './ProjectPortal.module.scss';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";  
import { spfi, SPFx } from "@pnp/sp";
import { 
    DetailsList, 
    SelectionMode,
     IColumn 
    } from '@fluentui/react/lib/DetailsList';
    import {
        DatePicker,
        // DatePicker,
        // Dropdown,
        // IDropdownOption,
        // IDropdownStyles,
        TextField,
    } from 'office-ui-fabric-react';
    // import { 
    //     PeoplePicker, 
    //     PrincipalType 
    // } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Panel, PanelType } from '@fluentui/react/lib/Panel';    
import * as moment from 'moment';
import {  
    Label, 
    PrimaryButton,
    // DefaultButton 
} from "office-ui-fabric-react";
import { ActivitiesAndControlpointsProps } from "./ActivitiesAndControlpointsProps";
import { IActivity } from "../Models/IActivity";
import { IControlPoints } from "../Models/IControlPoints";

//import { IActivity } from "../Models/IActivity";


const ActivitiesAndControlpoints: React.FC<ActivitiesAndControlpointsProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [myActivities, setMyActivities] = useState([]);
    const [myControls, setMyControls] = useState([]);
    const [myActivitieslistColumns, setmyActivitiesListColumns] = useState<IColumn[]>([]);
    const [myControlslistColumns, setmyControlsListColumns] = useState<IColumn[]>([]);
    const [updateListItems, setUpdateListItems] = useState(null);
    const [selectedActivityItem, setSelectedActivityItem] = useState<IActivity>({});
    const [selectedControlPointItem, setSelectedControlPointItem] = useState<IControlPoints>({});
    const [openPanel, setOpenPanel] = useState(null);
    // const [userForSelectedItem, setUserForSelectedItem] = useState([]);

    // const _getUserForSelectedItem = (props: IUser[]): void => {  setUserForSelectedItem(props);}
    const onUpdateActivityDone = (activity: IActivity): void =>{
        const upDateData = async (): Promise<any> =>{
            try{
               await sp.web.lists.getByTitle('Activity').items.getById(activity.Id).update({
                isDone: true
            });
            }
            catch(err){
                console.error(err);
            }       
        }
        setUpdateListItems(true);
        upDateData().catch((err) => {
            console.error(err);
        });
    }
    const onUpdateControlPointDone = (control: IControlPoints): void =>{
        const upDateData = async (): Promise<any> =>{
            try{
               await sp.web.lists.getByTitle('Control').items.getById(control.Id).update({
                isDone: true
            });
            }
            catch(err){
                console.error(err);
            }       
        }
        setUpdateListItems(true);
        upDateData().catch((err) => {
            console.error(err);
        });
    }

    const getSelectedActivityItem = (selectedItem: IActivity): void =>{
        setOpenPanel(true);
        setSelectedActivityItem(selectedItem);
        setSelectedControlPointItem({});
    }
    const getSelectedControlPointItem = (selectedItem: IControlPoints): void =>{
        setOpenPanel(true);
        setSelectedControlPointItem(selectedItem);
        setSelectedActivityItem({});
    }
    const onPanelToggleDismiss = (): void =>{
        setOpenPanel(false);
    }
//     useEffect(() => {
//     const handleResize = (): void => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener('resize', handleResize);

//     // Clean up the event listener when the component unmounts
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

    useEffect(() =>{
        const activitiesListColumns = [
            {
                key: 'column1', name: 'Rubrik', fieldName: 'Title', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column2', name: 'Projekt', fieldName: 'Projekt', minWidth: 100, maxWidth: 250, isResizable: true,  
            },
            {
                key: 'column3', name: 'Beskrivning', fieldName: 'Description', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column4', name: 'Ansvarig', fieldName: 'Responsible', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column5', name: 'Förfallodatum', fieldName: 'DueDate', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column6', name: '', fieldName: 'isDone', minWidth: 100, maxWidth: 250, isResizable: true, onRender:(activity: IActivity)  => {
                  const isDone : boolean = activity.isDone; 
                  const onShowButtonText = "Visa";  
                  const buttonText = isDone === true ? 'Klarmarkerad' : 'Klarmarkera';  
                  return(<div style={{display:'flex',flexWrap: 'wrap', flexDirection: 'row-reverse'}}> 
                    <PrimaryButton 
                    disabled={isDone}
                    text={buttonText}
                    // style={{width: activity
                    onClick={() => onUpdateActivityDone(activity)}                 
                    />
                    <PrimaryButton 
                    style={{
                        float: 'left', 
                        width: '119px', 
                        marginTop:'5px', 
                        // height: '25px'
                    }}
                    disabled={false}
                    text={onShowButtonText}
                    onClick={() => getSelectedActivityItem(activity)}                 
                    />
                  </div>)
                }
            }
            ]
        const controlListColumns = [
            {
                key: 'column1', name: 'Rubrik', fieldName: 'Title', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column2', name: 'Projekt', fieldName: 'Projekt', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column3', name: 'Beskrivning', fieldName: 'Description', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column4', name: 'Genomförd av', fieldName: 'ImplementedBy', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column5', name: 'Kontrolltyp', fieldName: 'ControlType', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column6', name: 'Datum', fieldName: 'Date', minWidth: 100, maxWidth: 250, isResizable: true, 
            },
            {
                key: 'column7', name: '', fieldName: 'isDone', minWidth: 100, maxWidth: 250, isResizable: true, onRender:(control: IControlPoints)  => {
                  const isDone : boolean = control.isDone;   
                  const onSaveButtonText = isDone === true ? 'Klarmarkerad' : 'Klarmarkera';  
                  const onShowButtonText = "Visa";
                  return(<div style={{display:'flex',flexWrap: 'wrap', flexDirection: 'row-reverse'}}>
                    <PrimaryButton 
                    // style={{width: '119px', marginTop:'5px', height: '25px'}}
                    disabled={isDone}
                    text={onSaveButtonText}
                    onClick={() => onUpdateControlPointDone(control)}                 
                    />
                    <PrimaryButton 
                    style={{
                        float:'left',
                        width: '119px',
                        marginTop:'5px', 
                        //   height: '25px'
                        }}
                    disabled={false}
                    text={onShowButtonText}
                    onClick={() =>  getSelectedControlPointItem(control) }                 
                    />
                  </div>)
                }
            }
            ]        
        setmyActivitiesListColumns(activitiesListColumns);
        setmyControlsListColumns(controlListColumns);
    },[]);
    useEffect(() => {
        const fetchActivityData = async (): Promise<any> => {
            try {
                const activityItems = await sp.web.lists.getByTitle('Activity').items
                .select(
                'Id',    
                'Title', 
                'Projekt/Title','Projekt/ID', 
                'Description',
                'DueDate',
                'isDone',
                'Responsible/Title',
                'Responsible/ID',
                ).expand('Projekt', 'Responsible').orderBy('Modified', true).getAll();
            
                const myActivities = activityItems.map((activity: any) => ({     
                    Id: activity.Id,              
                    Title: activity.Title,
                    Description: activity.Description,
                    DueDate: moment(activity.DueDate).format('YYYY-MM-DD'),
                    Responsible: activity.Responsible.Title,
                    Projekt: activity.Projekt.Title,
                    isDone: activity.isDone             
                }));
                    setUpdateListItems(false);
                    setMyActivities(myActivities);
                }
                catch (error) {
                    console.error(error);
                }
        };
        fetchActivityData().catch((err) => {
            console.error(err);
        });
    }, [updateListItems]); 
    useEffect(() => {
        const fetchControlPointsData = async (): Promise<any> => {
            try {
                const controlItems = await sp.web.lists.getByTitle('Control').items
                .select(
                'Id',   
                'Title',
                'ControlType',
                'Description',
                'Date',
                'isDone',
                'ImplementedBy/Title',
                'ImplementedBy/ID', 
                'Projekt/Title',
                'Projekt/ID'
                ).expand('Projekt','ImplementedBy').orderBy('Modified', true).getAll();
            
                const myControls = controlItems.map((control: any) => ({               
                    Id: control.Id,    
                    Title: control.Title,
                    Projekt: control.Projekt.Title,
                    Description: control.Description,
                    ControlType: control.ControlType,
                    ImplementedBy: control.ImplementedBy.Title,
                    Date: moment(control.Date).format('YYYY-MM-DD'),
                    isDone: control.isDone             
                }));
                    setUpdateListItems(false);
                    setMyControls(myControls);
                }
                catch (error) {
                    console.error(error);
                }
        };
        fetchControlPointsData().catch((err) => {
            console.error(err);
        });
    }, [updateListItems]); 

    return(<React.Fragment>
        <div>
        <Panel
          headerText="Egenskaper"
          type={PanelType.smallFixedFar}
          isOpen={openPanel}
          onDismiss={onPanelToggleDismiss}
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close"
        >
        {selectedActivityItem.Title !== undefined ? 
          <div>
        <TextField 
        label="Rubrik" 
        value={selectedActivityItem.Title} 
        disabled={true}
        />
         <TextField 
        label="Projekt" 
        value={selectedActivityItem.Projekt} 
        disabled={true}
        />
        <TextField 
        label="Beskrivning" 
        value={selectedActivityItem.Description} 
        disabled={true}
        multiline={true}
        rows={6}
        />
         <TextField 
        label="Ansvarig" 
        value={selectedActivityItem.Responsible} 
        disabled={true}
        />
        <DatePicker 
         label='Förfallodatum'
         disabled={true}
         placeholder={moment(selectedActivityItem.DueDate).format('YYYY-MM-DD')}
        />
        {/* <PeoplePicker
              context={props.context}
              titleText="Projektledare"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
              //onChange={ _getUserForSelectedItem }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            defaultSelectedUsers={selectedActivityItem.Responsible}
             resolveDelay={1000} 
             /> */}
        </div> 
          : null}
          {selectedControlPointItem.Title !== undefined ?
          <div>
          <TextField 
          label="Rubrik" 
          value={selectedControlPointItem.Title} 
          disabled={true}
          />
           <TextField 
          label="Projekt" 
          value={selectedControlPointItem.Projekt} 
          disabled={true}
          />
          <TextField 
          label="Beskrivning" 
          value={selectedControlPointItem.Description} 
          disabled={true}
          multiline={true}
          rows={6}
          />
           <TextField 
          label="Kontrolltyp" 
          value={selectedControlPointItem.ControlType} 
          disabled={true}
          />
            <TextField 
          label="Genomförd av" 
          value={selectedControlPointItem.ImplementedBy} 
          disabled={true}
          />
          <DatePicker 
           label='Datum'
           disabled={true}
           placeholder={moment(selectedActivityItem.DueDate).format('YYYY-MM-DD')}
          />
          {/* <PeoplePicker
                context={props.context}
                titleText="Projektledare"
                personSelectionLimit={1}
                //showtooltip={true}
                required={true}
                //onChange={ _getUserForSelectedItem }
                //showHiddenInUI={false}
                 principalTypes={[PrincipalType.User]}
              defaultSelectedUsers={selectedActivityItem.Responsible}
               resolveDelay={1000} 
               /> */}
          </div> : null  
        }
        </Panel>
        </div>
        <Label
        style={{fontSize:20, fontWeight: 500, marginBottom: 10}}
        >
        Mina aktiviteter
        </Label>
       <div style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 5px 0px', marginBottom: 40, padding:20}}>
        <div><DetailsList
                    items={myActivities}
                    columns={myActivitieslistColumns}
                    setKey="set"
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="select row"
                    //onColumnHeaderContextMenu={(column: IColumn, ev: React.MouseEvent<HTMLElement>) => this._onColumnContextMenu(column, ev)}
                    selectionMode={SelectionMode.none}
        /></div>
       </div>
       <Label
        style={{fontSize:20, fontWeight: 500, marginBottom: 10}}
        >
       Mina kontrollpunkter
        </Label>
       <div style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 5px 0px', padding:20}}>
        <div><DetailsList
                    items={myControls}
                    columns={myControlslistColumns}
                    setKey="set"
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="select row"
                    //onColumnHeaderContextMenu={(column: IColumn, ev: React.MouseEvent<HTMLElement>) => this._onColumnContextMenu(column, ev)}
                    selectionMode={SelectionMode.none}
        /></div>
       </div>
    </React.Fragment>);
}
export default ActivitiesAndControlpoints;