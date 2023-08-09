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
import * as moment from 'moment';
import {  Label } from "office-ui-fabric-react";
import { IMyActivitiesProps } from "./IMyActivitiesProps";
//import { IActivity } from "../Models/IActivity";


const MyActivities: React.FC<IMyActivitiesProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));

    const [myActivities, setMyActivities] = useState([]);
    const [myControls, setMyControls] = useState([]);
    const [myActivitieslistColumns, setmyActivitiesListColumns] = useState<IColumn[]>([]);
    const [myControlslistColumns, setmyControlsListColumns] = useState<IColumn[]>([]);

    useEffect(() =>{
        const activitiesListColumns = [
            {
                key: 'column1', name: 'Rubrik', fieldName: 'Title', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column2', name: 'Projekt', fieldName: 'Projekt', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column3', name: 'Beskrivning', fieldName: 'Description', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column4', name: 'Ansvarig', fieldName: 'Responsible', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column5', name: 'Förfallodatum', fieldName: 'DueDate', minWidth: 100, maxWidth: 150, isResizable: true, 
            }
            ]
        const controlListColumns = [
            {
                key: 'column1', name: 'Rubrik', fieldName: 'Title', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column2', name: 'Projekt', fieldName: 'Projekt', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column3', name: 'Beskrivning', fieldName: 'Description', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column4', name: 'Genomförd av', fieldName: 'ImplementedBy', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column5', name: 'Kontrolltyp', fieldName: 'ControlType', minWidth: 100, maxWidth: 150, isResizable: true, 
            },
            {
                key: 'column6', name: 'Datum', fieldName: 'Date', minWidth: 100, maxWidth: 100, isResizable: true, 
            }
            ]        
        setmyActivitiesListColumns(activitiesListColumns);
        setmyControlsListColumns(controlListColumns);
    },[]);

    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try {
                const activityItems = await sp.web.lists.getByTitle('Activity').items
                .select(
                'Title', 
                'Projekt/Title','Projekt/ID', 
                'Description',
                'DueDate',
                'Responsible/Title',
                'Responsible/ID'
                ).expand('Projekt', 'Responsible').orderBy('Modified', true).getAll();

                const controlItems = await sp.web.lists.getByTitle('Control').items
                .select(
                'Title',
                'ControlType',
                'Description',
                'Date',
                'ImplementedBy/Title','ImplementedBy/ID', 
                'Projekt/Title','Projekt/ID'
                ).expand('Projekt','ImplementedBy').orderBy('Modified', true).getAll();
            
                const myActivities = activityItems.map((activity: any) => ({                   
                    Title: activity.Title,
                    Description: activity.Description,
                    DueDate: moment(activity.DueDate).format('YYYY-MM-DD'),
                    Responsible: activity.Responsible.Title,
                    Projekt: activity.Projekt.Title,
                    
                }));
                const myControls = controlItems.map((control: any) => ({                   
                    Title: control.Title,
                    Projekt: control.Projekt.Title,
                    Description: control.Description,
                    ControlType: control.ControlType,
                    ImplementedBy: control.ImplementedBy.Title,
                    Date: moment(control.Date).format('YYYY-MM-DD')             
                }));
                setMyActivities(myActivities);
                setMyControls(myControls);
                }
                catch (error) {
                    console.error(error);
                }
        };
        fetchData().catch((err) => {
            console.error(err);
        });
    }, []); 

    return(<React.Fragment>
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
export default MyActivities;