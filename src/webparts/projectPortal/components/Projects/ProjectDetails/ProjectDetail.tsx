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
import { graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/graph/teams";
import { spfi, SPFx,  } from "@pnp/sp";
import { IProjectDetailProps } from "./IProjectDetailProps";
import { Label } from "office-ui-fabric-react";
import styles from "./ProjectDetail.module.scss"
import { IProject } from "../../Models";
// const theme = getTheme();
// const { palette, fonts } = theme;

const ProjectDetail: React.FC<IProjectDetailProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    const graph = graphfi().using(graphSPFx(props.context));
    const [selectedProject, setSelectedProject] = useState<IProject>({});
    const [selectedMSTeam, setSelectedMSTeam] = useState<any>({});
    
    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try {
                const currentUrl = window.location.href.split('/');
                const projectId = parseInt(currentUrl[currentUrl.length - 1]);
                const projectProps = await sp.web.lists.getByTitle("Projekt").items.getById(projectId).select(
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
                  'TeamsID'
                  )
                  .expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers')
                  ();
                  const teamsIdJsonString =  JSON.parse(projectProps.TeamsID);
                  const newTeamId = teamsIdJsonString.newTeamId; // Keep the full ID initially
                  const teams = await graph.teams.getById(`${newTeamId}`)();
        
                  const members = await graph.groups.getById(`${newTeamId}`).members();
                  const owners = await graph.groups.getById(`${newTeamId}`).owners();
                  const url = await graph.groups.getById(`${newTeamId}`)
                // const myProjects = items.map((projects: any) => ({  
                //     Id: projects.Id, 
                //     Title: projects.Title,
                //     Customer: projects.Customer,
                //     ProjectLeader: projects.ProjectLeader,
                //     ProjectManager: projects.ProjectManager,
                //     ProjectMembers: projects.ProjectMembers,
                //     ProjectImage: projects.ProjectImage,
                //     Status: projects.Status,
                //     ProjectType: projects.ProjectType
                // }));
                 console.log(members);
                 console.log(url);
                 setSelectedMSTeam(owners)
                 setSelectedProject(projectProps);
                 console.log(teams.group.sites);
                }
              catch (error) {
                console.error(error);
         }
        };
        fetchData().catch((err) => {
            console.error(err);
        });
    }, []); 

    console.log(selectedProject)
    console.log(selectedMSTeam)
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
              height: '100%'
            }}
          >
            <DocumentCardDetails styles={{root:{
              justifyContent: 'flex-start'
            }}}   >              
            <DocumentCardTitle 
            title={selectedProject.Title}
            className={styles.cardTitle} 
             />
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
    if(selectedProject.ProjectImage !== ''){
      return <img width={'100%'} height={'100%'} src={selectedProject.ProjectImage} />
    }
   }

return(<React.Fragment>
      <div className={styles.ProjectDetailsPage}>
         <div className={styles.projectDetailsAndFasWrapper}>
          <div className={styles.projectDetailsWrapper}>
            <div className={styles.projectDetailColumnOne}>
                {renderSelectedProject()}
            </div>
             <div className={styles.projectDetailColumnTwo} >
                  test2
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