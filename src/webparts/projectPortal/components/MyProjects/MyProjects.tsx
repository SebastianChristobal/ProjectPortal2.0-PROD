import * as React from "react";
import { 
    useState, 
    useEffect 
} from "react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";  
import { spfi, SPFx } from "@pnp/sp";
import {
    DocumentCard,
    DocumentCardDetails,
    DocumentCardTitle,
    DocumentCardImage,
    IDocumentCardStyles,
    // DocumentCardType,
    // IDocumentCardPreviewProps,
    // DocumentCardPreview
} from '@fluentui/react/lib/DocumentCard';
import {
  Pivot, 
  PivotItem, 
  PivotLinkFormat, 
  PivotLinkSize
} from  'office-ui-fabric-react';
import {  Label } from "office-ui-fabric-react";
//import { IIconProps } from '@fluentui/react/lib/Icon';
import { ImageFit } from '@fluentui/react/lib/Image';
 import styles from '../ProjectPortal.module.scss';
import { IMyProjectsProps } from "./IMyProjectsProps";
import { IProject } from "../Models";
//import { ProjectService } from '../services/';

const MyProject: React.FC<IMyProjectsProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    const [myProjects, setmyProjects] = useState([]);
    // const oneNoteIconProps: IIconProps = {
    //     iconName: 'OneNoteLogo',
    //     styles: { root: { color: '#813a7c', fontSize: '120px', width: '120px', height: '120px' } },
    //   };
    const cardStyles: IDocumentCardStyles = {
        root: { 
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '574px',
          marginBottom: '10px',
          minWidth: '180px',
          width: '100%',
        },
      };

    const onOpenProjectDetails = (project: IProject): void => {
      window.open(`#/ProjektDetaljer/${project.Id}`, "_self");
    }  

     useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try {
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
                  'Status'
                  ).expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers').orderBy('Modified', true).getAll();
                const myProjects = items.map((projects: IProject) => ({  
                    Id: projects.Id, 
                    Title: projects.Title,
                    Customer: projects.Customer,
                    ProjectLeader: projects.ProjectLeader,
                    ProjectManager: projects.ProjectManager,
                    ProjectMembers: projects.ProjectMembers,
                    ProjectImage: projects.ProjectImage,
                    Status: projects.Status,
                    ProjectType: projects.ProjectType
                }));
                myProjects.filter((project: IProject) =>
                project.ProjectLeader.ID === currentUser.Id ||
                project.ProjectManager.ID.includes(currentUser.Id) ||
                project.ProjectMembers.ID.includes(currentUser.Id) 
                );
                setmyProjects(myProjects);
                }
              catch (error) {
                console.error(error);
         }
        };
        fetchData().catch((err) => {
            console.error(err);
        });
    }, []); 

    const renderOnGoingProjects = myProjects.map((project: IProject) =>{
     // const projectimage: any = project.ProjectImage !== '' ? oneNoteIconProps : '';
        return(
              <Label key={project.Id} >
                            {project.Status === 'Pågående' &&
                            <DocumentCard
                            key={project.Id}
                            aria-label={
                              'Document Card with icon. How to make a good design. ' +
                              'Last modified by Christian Bergqvist in January 1, 2019.'
                            }
                            styles={cardStyles}
                            // onClickHref={`${props.siteAbsolutetUrl}/ProjektDetaljer/${project.Id}`}
                            onClick={() => onOpenProjectDetails(project) }
                          >
                            <div className={styles.imageWrapper}>
                            <DocumentCardImage height={150}  imageFit={ImageFit.cover} imageSrc={project.ProjectImage}  />
                            </div>
                            <DocumentCardDetails  className={styles.documentCardTitle} >
                              <div>{project.Title}</div>
                              <div>{project.Customer}</div>
                            </DocumentCardDetails>
                            
                          </DocumentCard>
                            }
              </Label>
      )
    });

    const finishedProjects = myProjects.map((project: IProject) =>{

      return (<Label key={project.Id}>
         {project.Status === 'Avslutad' &&
                            <DocumentCard
                            key={project.Id}
                            aria-label={
                              'Document Card with icon. How to make a good design. ' +
                              'Last modified by Christian Bergqvist in January 1, 2019.'
                            }
                            styles={cardStyles}
                            // onClickHref={`${props.siteAbsolutetUrl}/ProjektDetaljer/${project.Id}`}
                            onClick={() => onOpenProjectDetails(project) }
                          >
                            <div className={styles.imageWrapper}>
                            <DocumentCardImage height={150}  imageFit={ImageFit.cover} imageSrc={project.ProjectImage}  />
                            </div>
                            <DocumentCardDetails>
                              <DocumentCardTitle title={project.Title} shouldTruncate />
                              <DocumentCardTitle title={project.Customer } />
                            </DocumentCardDetails>
                            
                          </DocumentCard>
                            }
      </Label>)

      
    });

    return(<React.Fragment>
        <Label
        style={{fontSize:20, fontWeight: 500, marginBottom:10}}
        >
        Mina projekt
        </Label>
        <div className={styles.myProjects}>
          <Pivot 
          defaultSelectedKey={"0"}
          linkFormat={PivotLinkFormat.tabs}
          linkSize={PivotLinkSize.large}
          styles={{ 
            link: {borderStyle:'solid', borderWidth:'1px', marginRight:'2px', width:'49%'},
            linkIsSelected: {borderStyle:'solid', borderWidth:'1px', borderColor:'black', marginRight:'2px', width:'49%'},
            linkContent: {padding:'0px 8px 0px 8px'}
            }}
          >
            <PivotItem 
             headerText="Pågående"
             itemKey="Pågående"
             >
              {
              renderOnGoingProjects
              }
              </PivotItem>
             <PivotItem 
             headerText="Avslutade"        
             itemKey="Avslutade"
             >
              {
                finishedProjects
              }
             </PivotItem>
      </Pivot>
        </div>
    </React.Fragment>);
}

export default MyProject;




