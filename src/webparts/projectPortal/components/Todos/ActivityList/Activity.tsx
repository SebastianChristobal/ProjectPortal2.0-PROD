import * as React from "react";
import { useState, useEffect } from "react";
import {
    DocumentCard,
    DocumentCardDetails,
    DocumentCardTitle,
    DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  // IPivotStyles,
} from "office-ui-fabric-react";
import { spfi, SPFx } from "@pnp/sp";
import * as moment from "moment";
import {
  PrimaryButton,
  // Label,
  // DefaultButton
} from "office-ui-fabric-react";
import styles from "../Todos.module.scss";
import { IActivityProps } from "./IActivityProps";
import { IActivity } from "../../Models/IActivity";


const Activity: React.FC<IActivityProps> = (props) =>{
 const sp = spfi().using(SPFx(props.context));
 const [ongoingActivities, setOngoingActivities] = useState([]);
const [completedActivities, setCompletedActivities] = useState([]);
//  const [activitieslistColumns, setActivitiesListColumns] = useState<IColumn[]>([]);
 const [updateListItems, setUpdateListItems] = useState(null);
 const [selectedActivityItem, setSelectedActivityItem] = useState<IActivity>({});   

 const onUpdateActivityDone = (activity: IActivity): void => {
    const upDateData = async (): Promise<any> => {
      try {
        await sp.web.lists
          .getByTitle("Activity")
          .items.getById(activity.Id)
          .update({
            isDone: true,
          });
      } catch (err) {
        console.error(err);
      }
    };
    setUpdateListItems(true);
    upDateData().catch((err) => {
      console.error(err);
    });
  };
  const getSelectedActivityItem = (selectedItem: IActivity): void => {
    setSelectedActivityItem(selectedItem);
  };

  useEffect(() => {
    const fetchActivityData = async (): Promise<any> => {
      try {
        const activityItems = await sp.web.lists
          .getByTitle("Activity")
          .items.select(
            "Id",
            "Title",
            "Projekt/Title",
            "Projekt/ID",
            "Description",
            "DueDate",
            "isDone",
            "Responsible/Title",
            "Responsible/ID"
          )
          .expand("Projekt", "Responsible")
          .orderBy("Modified", true)
          .getAll();
        const ongoingActivities = activityItems.map((activity: any) => ({
          Id: activity.Id,
          Title: activity.Title,
          Description: activity.Description,
          DueDate: moment(activity.DueDate).format("YYYY-MM-DD"),
          Responsible: activity.Responsible.Title,
          Projekt: activity.Projekt.Title,
          isDone: activity.isDone,
        })).filter(item => item.isDone !== true);

        const completedActivities = activityItems.map((activity: any) => ({
          Id: activity.Id,
          Title: activity.Title,
          Description: activity.Description,
          DueDate: moment(activity.DueDate).format("YYYY-MM-DD"),
          Responsible: activity.Responsible.Title,
          Projekt: activity.Projekt.Title,
          isDone: activity.isDone,
        })).filter(item => item.isDone === true);
        
        setUpdateListItems(false);
        setCompletedActivities(completedActivities);
        setOngoingActivities(ongoingActivities);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivityData().catch((err) => {
      console.error(err);
    });
  }, [updateListItems]);

  console.log(selectedActivityItem, completedActivities);

  const renderOngoingActivities = (): JSX.Element =>{
    const activity: any = ongoingActivities.length > 0 ? ongoingActivities.map((items: IActivity) =>{
      const activityTitle = `Rubrik: ${items.Title}`;
      const activityProject = `Projekt: ${items.Projekt}`;
      const activityDescription = `Beskrivning: ${items.Description}`
      const activityManager = `Ansvarig: ${items.Responsible}`;
      const activityDueDate = `Förfallodatum: ${items.DueDate}`;
      const isDone: boolean = items.isDone;
      const onShowButtonText = "Visa";
      const buttonText = isDone === true ? "Klarmarkerad" : "Klarmarkera";
      return(<DocumentCard
        key={items.Id}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: '100%',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails  >        
        <DocumentCardTitle title={activityTitle} className={styles.cardTitle} />
        <span key={items.Id} className={styles.cardItemProperties}>{activityProject}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{activityManager}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{activityDueDate}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{activityDescription}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={items.isDone}
                text={buttonText}
                onClick={() => onUpdateActivityDone(items)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedActivityItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>)
      
    }) : null;

    return activity;
  }

  const renderCompletedActivities = (): JSX.Element =>{
    const activity: any = completedActivities.length > 0 ? completedActivities.map((items: IActivity) =>{
      const activityTitle = `Rubrik: ${items.Title}`;
      const activityProject = `Projekt: ${items.Projekt}`;
      const activityDescription = `Beskrivning: ${items.Description}`
      const activityManager = `Ansvarig: ${items.Responsible}`;
      const activityDueDate = `Förfallodatum: ${items.DueDate}`;
      const isDone: boolean = items.isDone;
      const onShowButtonText = "Visa";
      const buttonText = isDone === true ? "Klarmarkerad" : "Klarmarkera";
      return(<DocumentCard
        key={items.Id}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: '100%',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails  >        
        <DocumentCardTitle title={activityTitle} className={styles.cardTitle} />
        <span key={items.Id} className={styles.cardItemProperties}>{activityProject}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{activityManager}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{activityDueDate}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{activityDescription}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={items.isDone}
                text={buttonText}
                onClick={() => onUpdateActivityDone(items)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedActivityItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>)
      
    }) : null;

    return activity;
  }
 return( <div>
        <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
      >
        <PivotItem headerText="Pågående" itemKey="ongoing">
          {ongoingActivities.length > 0 ?    <div
            style={{
              marginBottom: 40,
              padding: 20,
              marginTop: 6,
            }}
          >
            { renderOngoingActivities() }
          </div> : <div style={{fontSize:'16px', paddingTop: '30px', paddingLeft:'10px', color: '#9b8f8f'}}>Inga aktiva ärenden...</div>}
        </PivotItem>
        <PivotItem headerText="Avslutade" itemKey="completed">
          <div
            style={{
              padding: 20,
              marginTop: 6,
            }}
          >
            { renderCompletedActivities()}
          </div>
        </PivotItem>
      </Pivot>
  
  </div>);
}




export default Activity;