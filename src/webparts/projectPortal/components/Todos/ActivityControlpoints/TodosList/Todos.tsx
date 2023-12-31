import * as React from "react";
import { 
  useState,
  useEffect,  
  //useReducer  
  } 
from "react";
import {
    DocumentCard,
    DocumentCardDetails,
    DocumentCardTitle,
    // IDocumentCardStyles,
    DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import "@pnp/sp/webs";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import '@pnp/graph/groups';
import "@pnp/graph/sites/group";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import { Web } from "@pnp/sp/webs";   
import { spfi, SPFx } from "@pnp/sp";
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  // IPivotStyles,
} from "office-ui-fabric-react";
 //import { graphfi, SPFx as graphSPFx } from "@pnp/graph";

 //import * as moment from "moment";
import {
  PrimaryButton,
} from "office-ui-fabric-react";
import styles from "../../Activities.module.scss";
import { ITodosProps } from "./ITodosProps";
import { IActivity } from "../../../Models/IActivity";
import { IProject } from "../../../Models";

const Todos: React.FC<ITodosProps> = (props) =>{
const sp = spfi().using(SPFx(props.context));
const [activities, setActivities] = useState([]);
const [currentUserProjects, setCurrentUserProjects] = useState([]);
const [updateListItems, setUpdateListItems] = useState(null);


 const onActivityDone = (activity: IActivity, project: IProject): void => {
  const web = Web(project.AbsoluteSiteUrl).using(SPFx(props.context));
  const updatedData = {
      isDone: true,
      // Add other properties you want to update
    };
    const upDateData = async (): Promise<any> => {
      try {
        await web.lists.getByTitle('Activities').items.getById(activity.Id).update(updatedData);
        console.log('Item updated successfully:');  
        // Refresh your data or UI if needed
      } catch (error) {
        console.error(`Error processing update:`, error);
      }
    };
    
    setUpdateListItems(true);
    upDateData().catch((err) => {
      console.error(err);
    });
  };
  // const getSelectedActivityItem = (selectedItem: IActivity): void => {
  //   setSelectedActivityItem(selectedItem);
  // };
  const fetchActivities = async (): Promise<any> =>{
      const currentUser = await sp.web.currentUser();
      setUpdateListItems(false);
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
        'Status'
        ).expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers').orderBy('Modified', true).getAll();
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
          AbsoluteSiteUrl: projects.absoluteSiteUrl
      })).filter(item => 
        item.ProjectLeader.ID === currentUser.Id || 
        item.ProjectManager.ID === currentUser.Id || 
        item.ProjectMembers.some((member: any) => member.ID === currentUser.Id)
       );
    setCurrentUserProjects(myProjects);
    await Promise.all(myProjects.map(async (project: any) => {
      try {
        // Construct the full SharePoint REST API URL for lists
        const listsUrl = `${project.AbsoluteSiteUrl}/_api/web/lists/getbytitle('Activities')/items?$select=*,ContentType/Name&$expand=ContentType`;
    
        // Fetch lists using SharePoint REST API
        const response = await fetch(listsUrl, {
          method: 'GET',
          headers: {
            'ACCEPT': 'application/json',
          },
        });       
        if (response.ok) {
          const listsData = await response.json();
          setActivities(listsData.value);
          //console.log(`Lists for site ${siteUrl.webUrl}:`, listsData.value);
        } else {
          console.error(`Error fetching lists for site ${project.AbsoluteSiteUrl}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error processing site ${project.AbsoluteSiteUrl}:`, error);
      }
    })); 
  }  

  useEffect(() => {
    fetchActivities().catch((err) => {
      console.error(err);
  });
  
  }, [updateListItems])

  const renderOngoingActivities = (): JSX.Element =>{
    const activity: any = activities.length > 0 ? activities.map((items: IActivity) =>{
    const project : any = currentUserProjects.length > 0 ? currentUserProjects.map((project: any) =>{
    const activityTypeName = items.ContentType.Name === 'Controlpoint' ? 'Kontrollpunkt': 'Aktivitet';
    if( items.isDone !== true ){
          const activityTitle = `${items.Title}`;
          const activityContentTypeName= `Typ: ${activityTypeName}`
          const activityProject = `Projekt: ${project.Title}`;
          const activityDescription = `Beskrivning: ${items.Description}`;
          // const activityDueDate = `Förfallodatum: ${items.DueDate1 !== undefined ? items.DueDate1 : ''}`;
          const onShowButtonText = "Visa";
          const buttonText = "Klarmarkera";
            return(<DocumentCard
            key={items.Id}
            type={DocumentCardType.compact}
           // onClick={() => this.onOpenPanelHandler(items)}
            style={{
              maxWidth: '100%',
              height: 'auto',
              marginTop: '15px',
              padding: '5px'
            }}
          >
            <DocumentCardDetails>        
            <DocumentCardTitle title={activityTitle} className={styles.cardTitle} />
            <span key={items.Id} className={styles.cardItemProperties}>{activityProject}</span>
            <span key={items.Id} className={styles.cardItemProperties}>{activityContentTypeName}</span>
            <span key={items.Id} className={styles.cardItemProperties}>{activityDescription}</span>
            <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
            <PrimaryButton
                    disabled={items.isDone}
                    text={buttonText}
                    onClick={() => onActivityDone(items, project)}
                  />
                  <PrimaryButton
                    style={{
                      width: "119px",
                      marginTop: "5px",
                      marginLeft: '5px'
                    }}
                    disabled={false}
                    text={onShowButtonText}
                    // onClick={() => getSelectedActivityItem(items)}
                  />
            </div>
            </DocumentCardDetails>
          </DocumentCard>)
        }       
      }) : null;
      return project;
    }): null;
    return activity;
  }

  const renderCompletedActivities = (): JSX.Element =>{
    const activity: any = activities.length > 0 ? activities.map((items: any) =>{
    const project : any = currentUserProjects.length > 0 ? currentUserProjects.map((project: any) =>{
    const activityTypeName = items.ContentType.Name === 'Controlpoint' ? 'Kontrollpunkt': 'Aktivitet';
    if( items.isDone === true ){
          const activityTitle = `Rubrik: ${items.Title}`;
          const activityContentTypeName= `Typ: ${activityTypeName}`;
          const activityProject = `Projekt: ${project.Title}`;
          const activityDescription = `Beskrivning: ${items.Description}`;
          // const activityDueDate = `Förfallodatum: ${items.DueDate1 !== undefined ? items.DueDate1 : ''}`;
          const onShowButtonText = "Visa";
          const buttonText = "Klarmarkerad";
            return(<DocumentCard
            key={items.Id}
            type={DocumentCardType.compact}
           // onClick={() => this.onOpenPanelHandler(items)}
            style={{
              maxWidth: '100%',
              height: 'auto',
              marginTop: '15px',
              padding: '5px'
            }}
          >
            <DocumentCardDetails>        
            <DocumentCardTitle title={activityTitle} className={styles.cardTitle} />
            <span key={items.Id} className={styles.cardItemProperties}>{activityProject}</span>
            <span key={items.Id} className={styles.cardItemProperties}>{activityContentTypeName}</span>
            <span key={items.Id} className={styles.cardItemProperties}>{activityDescription}</span>
            <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
            <PrimaryButton
                    disabled={items.isDone}
                    text={buttonText}
                    onClick={() => onActivityDone(items, project)}
                  />
                  <PrimaryButton
                    style={{
                      width: "119px",
                      marginTop: "5px",
                      marginLeft: '5px'
                    }}
                    disabled={false}
                    text={onShowButtonText}
                    // onClick={() => getSelectedActivityItem(items)}
                  />
            </div>
            </DocumentCardDetails>
          </DocumentCard>)
        }       
      }) : null;
      return project;
    }): null;
    return activity;
  }
 
 return( <div>
        <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
      >
        <PivotItem headerText="Pågående" itemKey="ongoing">
          {<div
            style={{
              marginBottom: 40,
              padding: 20,
              marginTop: 6,
            }}
          >
            { renderOngoingActivities() }
          </div>}
        </PivotItem>
        <PivotItem headerText="Avslutade" itemKey="completed">
          <div
            style={{
              padding: 20,
              marginTop: 6,
            }}
          >
            { renderCompletedActivities() }
          </div>
        </PivotItem>
      </Pivot>
  
  </div>);
}




export default Todos;