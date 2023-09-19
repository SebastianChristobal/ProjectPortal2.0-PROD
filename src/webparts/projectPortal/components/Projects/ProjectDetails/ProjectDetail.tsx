import * as React from "react";
import { useState, useEffect } from "react";
import {
    DocumentCard,
    DocumentCardDetails,
    DocumentCardTitle,
    DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
// import { getTheme } from '@fluentui/react/lib/Styling';
// import {
//     PrimaryButton,
//     // Label,
//     // DefaultButton
//   } from "office-ui-fabric-react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import '@pnp/graph/groups';
import "@pnp/graph/members";
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
//import { graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/graph/teams";
import { spfi, SPFx,  } from "@pnp/sp";
import { IProjectDetailProps } from "./IProjectDetailProps";
import { Label } from "office-ui-fabric-react";
import styles from "./ProjectDetail.module.scss"
import { IProject } from "../../Models";
// const theme = getTheme();
// const { palette, fonts } = theme;

const iconClass = mergeStyles({
  fontSize: 17,
  height: 17,
  width: 15,
  marginLeft: '32px',
  marginRight: '30px'
});

const ProjectDetail: React.FC<IProjectDetailProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    const [selectedProject, setSelectedProject] = useState<IProject>({});
    const [isOpen, setIsOpen] = useState(false);

    const editSelectedProject = (): void => {
      setIsOpen(true)
    }
    const dismissPanel = (): void => {
      setIsOpen(false);
    }

    const fetchSelectedProject = async (): Promise<any> => {
      try {
          const currentUrl = window.location.href.split('/');
          const projectId = parseInt(currentUrl[currentUrl.length - 1]);
          const selectedProject = await sp.web.lists.getByTitle("Projekt").items.getById(projectId).select(
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
            'Status',
            'Budget',
            'Resources',
            'Time'
            )
            .expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers')();
           setSelectedProject(selectedProject);
          }
        catch (error) {
          console.error(error);
   }
  };
    
    useEffect(() => {
      fetchSelectedProject().catch((err) => {
            console.error(err);
        });
    }, []); 

   const renderSelectedProject = ():JSX.Element =>{
    if(selectedProject.Title !== undefined){
      const projectMembers = selectedProject.ProjectMembers.map((members: any) => {return members.Title});
      const selectedProjectLeader = `Projektledare: ${selectedProject.ProjectLeader.Title}`
      const selectedProjectManager = `Projektansvarig: ${selectedProject.ProjectManager.Title}`
      const selectedProjectMemebers = `Projektmedlemmar: ${projectMembers}`
      const selectedProjectType = `Projekttyp: ${selectedProject.ProjectType.Title}`
      const selectedProjectCustomer = `Kund: ${selectedProject.Customer}`

        return(<DocumentCard
            key={selectedProject.Id}
            type={DocumentCardType.compact}
           // onClick={() => this.onOpenPanelHandler(items)}
            style={{
              maxWidth: '100%',
              height: '100%',
              border: 'none'
            }}
          >
            <DocumentCardDetails styles={{root:{
              justifyContent: 'flex-start'
            }}}   >              
            <div style={{display:'flex', alignItems: 'center', minHeight: '40px' }}>
              <DocumentCardTitle 
              title={selectedProject.Title}
              className={styles.cardTitle} 
             />
            <FontIcon aria-label="OpenEnrollment" iconName="OpenEnrollment" className={iconClass}  onClick={editSelectedProject}/>
            </div>
            <span  className={styles.cardItemProperties}>{selectedProjectCustomer}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectType}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectLeader}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectManager}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectMemebers}</span>
            </DocumentCardDetails>
          </DocumentCard>);
    }
   }

   const renderProjectImage = (): JSX.Element =>{
    if(selectedProject.ProjectImage !== undefined){
      return <img width={'100%'} height={'100%'} src={selectedProject.ProjectImage} />
    }
   }
   
   const getStatusColor = (status: any): any => { 
    switch (status) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'yellow';
      case 'High':
        return 'red';
      default:
        return 'gray'; // You can set a default color for other cases
    }
  };
   const renderProjectStatuses = (): JSX.Element =>{
    if (selectedProject.Title !== undefined) {
      return (
        <React.Fragment>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', padding:'20px 1px 1px 20px'}}>
            <div style={{minWidth: '70px'}}>Budget</div>
            <div style={{ backgroundColor: getStatusColor(selectedProject.Budget), width: '15px', height: '15px', borderRadius: '10px' }} />
          </div>
          <div style={{width: '100%', display: 'flex', alignItems: 'center',  padding:'20px 1px 1px 20px' }}>
          <div style={{minWidth: '70px'}}>Tid</div>
            <div  style={{ backgroundColor: getStatusColor(selectedProject.Time), width: '15px', height: '15px', borderRadius: '10px' }}/>
          </div>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', padding:'20px 1px 1px 20px' }}>
          <div style={{minWidth: '70px'}}>Resurser</div>
            <div style={{ backgroundColor: getStatusColor(selectedProject.Resources), width: '15px', height: '15px', borderRadius: '10px' }}/>
          </div>
        </React.Fragment>
      );
    }
   }


return(<React.Fragment>
      <div className={styles.ProjectDetailsPage}>
        {
           <Panel
           isOpen={isOpen}
           onDismiss={dismissPanel}
           type={PanelType.smallFixedFar}
           //customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined}
           closeButtonAriaLabel="Stäng"
           headerText="Redigera"
         >
           <p>
            hejsan
             {/* This is {a} <strong>{description}</strong> panel
             {panelType === PanelType.smallFixedFar ? ' (the default size)' : ''}. */}
           </p>
           {/* <p>
             Select this size using <code>{`type={PanelType.${PanelType[panelType]}}`}</code>.
           </p> */}
         </Panel>
        }
         <div className={styles.projectDetailsAndFasWrapper}>
          <div className={styles.projectDetailsWrapper}>
            <div className={styles.projectDetailColumnOne}>
                {renderSelectedProject()}
            </div>
             <div className={styles.projectDetailColumnTwo} >
                 {renderProjectStatuses()}
            </div>       
            <div className={styles.projectDetailColumnThree} >
                 {renderProjectImage()}
          </div>     
        </div>
         <div className={styles.projectFasWrapper}>
                <div>
                            <Label
                            style={{fontSize:18, fontWeight: 500}}
                            >
                            ProjektFaser</Label>
                        </div>
                    </div>
            </div>
            <div className={styles.projectDetailButtonsWrapper}>
            knappar
            </div>
            <div className={styles.projectListItemsAndDocWrapper}>
            <div className={styles.controllPointColumn}>
                    Kontrollpukter
            </div>
            <div className={styles.activityColumn}>
                    Items
            </div>
            <div className={styles.ataColumn}>
                    ÄTA
            </div>
            <div className={styles.documentColumn}>
                    Docs
            </div>
            </div>
        </div></React.Fragment>);
}



export default ProjectDetail;