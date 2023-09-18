import * as React from "react";
import { IATAProps } from "./IATAProps";
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
import styles from "../../Activities.module.scss";
import {
  PrimaryButton,
  // Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { IATA } from "../../../Models/IATA";

const ATA: React.FC<IATAProps> = (props) =>{

    const sp = spfi().using(SPFx(props.context));
    const [ATA, setATA] = useState([]);
    // const [selectedATAItem, setSelectedATAItem] =useState<IATA>({});
    const [currentUserProjects, setCurrentUserProjects] = useState([]);
    const [updateListItems, setUpdateListItems] = useState(null);

    const onUpdateATADone = (ata: IATA): void => {
        const upDateData = async (): Promise<any> => {
          try {
            await sp.web.lists
              .getByTitle("ATA")
              .items.getById(ata.Id)  
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

      // const getSelectedATAItem = (selectedItem: IATA): void => {
      //   setSelectedATAItem(selectedItem);
      // };
      const fetchATA = async (): Promise<any> => {
        const currentUser = await sp.web.currentUser();
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
      })).filter((item: any) => 
        item.ProjectLeader.ID === currentUser.Id || 
        item.ProjectManager.ID === currentUser.Id || 
        item.ProjectMembers.some((member: any) => member.ID === currentUser.Id)
       );
        setCurrentUserProjects(myProjects);
        await Promise.all(myProjects.map(async (project: any) => {
          try {
            // Construct the full SharePoint REST API URL for lists
            const listsUrl = `${project.AbsoluteSiteUrl}/_api/web/lists/getbytitle('ATA')/items`;
        
            // Fetch lists using SharePoint REST API
            const response = await fetch(listsUrl, {
              method: 'GET',
              headers: {
                'ACCEPT': 'application/json',
              },
            });       
            if (response.ok) {
              const listsData = await response.json();
              setATA(listsData.value);
              //console.log(`Lists for site ${siteUrl.webUrl}:`, listsData.value);
            } else {
              console.error(`Error fetching lists for site ${project.AbsoluteSiteUrl}:`, response.statusText);
            }
          } catch (error) {
            console.error(`Error processing site ${project.AbsoluteSiteUrl}:`, error);
          }
        })); 
      };
      useEffect(() => {
        fetchATA().catch((err) => {
          console.error(err);
        });
      }, [updateListItems]);
      
      // console.log(selectedATAItem);

  const renderOngoingATA = (): JSX.Element => {

     const ata: any = ATA.length > 0 ? ATA.map((items: IATA) =>{
      const project : any = currentUserProjects.length > 0 ? currentUserProjects.map((project: any) =>{
        if( items.isDone !== true ){
      const ataTitle = `Rubrik: ${items.Title}`;
      const ataProject = `Projekt: ${project.Title}`;
      const ataCustomer = `Beställare: ${items.Customer}`
      const ataExtent = `Omfattning: ${items.Extent}`;
      const ataPrice = `Prissättning: ${items.Price}`;
      const isDone: boolean = items.isDone;
      const onShowButtonText = "Visa";
      const buttonText =  "Klarmarkera";
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
        <DocumentCardDetails  >        
        <DocumentCardTitle title={ataTitle} className={styles.cardTitle} />
        <span key={items.Id} className={styles.cardItemProperties}>{ataProject}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{ataCustomer}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{ataExtent}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{ataPrice}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={isDone}
                text={buttonText}
                onClick={() => onUpdateATADone(items)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
                text={onShowButtonText}
                // onClick={() => getSelectedATAItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>)
      }
    }) : null;
    return project;
  }): null;
  return ata;
  }
   const renderCompletedATA = ():JSX.Element =>{
      const ata: any = ATA.length > 0 ? ATA.map((items: IATA) =>{
        const project : any = currentUserProjects.length > 0 ? currentUserProjects.map((project: any) =>{
          if( items.isDone === true ){
        const ataTitle = `Rubrik: ${items.Title}`;
        const ataProject = `Projekt: ${project.Title}`;
        const ataCustomer = `Beställare: ${items.Customer}`
        const ataExtent = `Omfattning: ${items.Extent}`;
        const ataPrice = `Prissättning: ${items.Price}`;
        const isDone: boolean = items.isDone;
        const onShowButtonText = "Visa";
        const buttonText = "Klarmarkerad";
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
          <DocumentCardTitle title={ataTitle} className={styles.cardTitle} />
          <span key={items.Id} className={styles.cardItemProperties}>{ataProject}</span>
          <span key={items.Id} className={styles.cardItemProperties}>{ataCustomer}</span>
          <span key={items.Id} className={styles.cardItemProperties}>{ataExtent}</span>
          <span key={items.Id} className={styles.cardItemProperties}>{ataPrice}</span>
          <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
          <PrimaryButton
                  disabled={isDone}
                  text={buttonText}
                  onClick={() => onUpdateATADone(items)}
                />
                <PrimaryButton
                  style={{
                    width: "119px",
                    marginTop: "5px",
                    marginLeft: '5px'
                  }}
                  disabled={false}
                  text={onShowButtonText}
                  // onClick={() => getSelectedATAItem(items)}
                />
          </div>
          </DocumentCardDetails>
        </DocumentCard>)
      }
      }) : null;
  
      return project;
    }): null;
    return ata;
  }

      return<div>     
          <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
      >
        <PivotItem headerText="Pågående" itemKey="ongoing">
          {ATA.length > 0 ? <div
            style={{
              marginBottom: 40,
              padding: 20,
              marginTop: 6,
            }}
          >
         { renderOngoingATA() }
          </div> : <div style={{fontSize:'16px', paddingTop: '30px', paddingLeft:'10px', color: '#9b8f8f'}}>Inga aktiva ärenden...</div>}
        </PivotItem>
        <PivotItem headerText="Avslutade" itemKey="completed">
          <div
            style={{
              padding: 20,
              marginTop: 6,
            }}
          >
          { renderCompletedATA() }
          </div>
        </PivotItem>
      </Pivot>
    
    </div>;
}

export default ATA;