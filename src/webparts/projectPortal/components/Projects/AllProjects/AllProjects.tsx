import * as React from 'react';
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
    // DocumentCardTitle,
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
    PivotLinkSize,
    IPivotStyles,
  } from  'office-ui-fabric-react';
  import { ImageFit } from '@fluentui/react/lib/Image';
import { 
    Label
   } from "office-ui-fabric-react";
import styles from "./AllProjects.module.scss";
import { IProject } from "../../Models";
import { IAllProjectsProps } from './IAllProjectsProps';

const pivotStyles: Partial<IPivotStyles> = {
    // root: {
    //   display: "flex",
    //   flexWrap: "wrap",
    // },
    //   itemContainer: {
    //     backgroundColor: "#ABEBC6",
    //   },
    link: {
      borderStyle: "solid",
      borderWidth: "1px",
      marginRight: "7px",
      width: "auto",
      borderRadius: "5px 5px 0px 0px"
    },
    linkIsSelected: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "black",
      marginRight: "7px",
      width: "auto",
      borderRadius: "5px 5px 0px 0px"
    },
  };

const AllProjects : React.FC<IAllProjectsProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    const [ongoingProjects, setOngoingProjects] = useState([]);
    const [comnpletedProjects, setCompletedProjects] = useState([]);

    const cardStyles: IDocumentCardStyles = {
        root: { 
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '574px',
          marginBottom: '10px',
          minWidth: '180px',
          width: '100%'
        },
      };

      const onOpenProjectDetails = (project: IProject): void => {
        window.open(`#/ProjektDetaljer/${project.Id}`, "_self");
      }    
      useEffect(() => {
        const fetchData = async (): Promise<any> => {
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
                  'Status'
                  ).expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers').orderBy('Modified', true).getAll();
                
                  const ongoingProjects = items.map((projects: IProject) => ({  
                    Id: projects.Id, 
                    Title: projects.Title,
                    Customer: projects.Customer,
                    ProjectLeader: projects.ProjectLeader,
                    ProjectManager: projects.ProjectManager,
                    ProjectMembers: projects.ProjectMembers,
                    ProjectImage: projects.ProjectImage,
                    Status: projects.Status,
                    ProjectType: projects.ProjectType
                })).filter(item => item.Status === "Pågående");

                const completedProjects = items.map((projects: IProject) => ({  
                    Id: projects.Id, 
                    Title: projects.Title,
                    Customer: projects.Customer,
                    ProjectLeader: projects.ProjectLeader,
                    ProjectManager: projects.ProjectManager,
                    ProjectMembers: projects.ProjectMembers,
                    ProjectImage: projects.ProjectImage,
                    Status: projects.Status,
                    ProjectType: projects.ProjectType
                })).filter(item => item.Status === "Avslutad");
                setOngoingProjects(ongoingProjects)
                setCompletedProjects(completedProjects);
                }
              catch (error) {
                console.error(error);
         }
        };
        fetchData().catch((err) => {
            console.error(err);
        });
    }, []); 

    const renderOngoingProjects = (): JSX.Element =>{

        const ongoingProject: any = ongoingProjects.length > 0 ? ongoingProjects.map((items: IProject) =>{

            return(<DocumentCard
                  key={items.Id}
                  aria-label={
                    'Document Card with icon. How to make a good design. ' +
                    'Last modified by Christian Bergqvist in January 1, 2019.'
                  }
                  styles={cardStyles}
                  // onClickHref={`${props.siteAbsolutetUrl}/ProjektDetaljer/${project.Id}`}
                  onClick={() => onOpenProjectDetails(items) }
                >
                  <div className={styles.imageWrapper}>
                  <DocumentCardImage height={150}  imageFit={ImageFit.cover} imageSrc={items.ProjectImage}  />
                  </div>
                  <DocumentCardDetails  className={styles.documentCardTitle} >
                    <div>{items.Title}</div>
                    <div>{items.Customer}</div>
                  </DocumentCardDetails>               
                </DocumentCard>
           )
        
        }): null;
        return ongoingProject;
    }   
    const renderCompletedProjects = (): JSX.Element =>{

        const completedProjects: any = comnpletedProjects.length > 0 ? comnpletedProjects.map((items: IProject) =>{
            return(<DocumentCard
                  key={items.Id}
                  aria-label={
                    'Document Card with icon. How to make a good design. ' +
                    'Last modified by Christian Bergqvist in January 1, 2019.'
                  }
                  styles={cardStyles}
                  // onClickHref={`${props.siteAbsolutetUrl}/ProjektDetaljer/${project.Id}`}
                  onClick={() => onOpenProjectDetails(items) }
                >
                  <div className={styles.imageWrapper}>
                  <DocumentCardImage height={150}  imageFit={ImageFit.cover} imageSrc={items.ProjectImage}  />
                  </div>
                  <DocumentCardDetails  className={styles.documentCardTitle} >
                    <div>{items.Title}</div>
                    <div>{items.Customer}</div>
                  </DocumentCardDetails>               
                </DocumentCard>
           )
        
        }): null;
        return completedProjects;
    }   


    return(<React.Fragment>
        <div className={styles.allProjectsWrapper}>
            <div className={styles.allProjectsTopNav}>
                <div>
                    <Label
                    style={{fontSize:20, fontWeight: 500, marginBottom:10}}
                    >
                    Här kan vi se alla Projekt som har skapats.</Label>
                </div>
                <div className={styles.allProjectsHeaderText}>
                    <Label
                    style={{fontSize:18, fontWeight: 400}}
                    >
                    {/* Använd formuläret nedan för att registrera en ändring, tillägg och avgående. */}
                    </Label>
                </div>
            </div>
        <div className={styles.pivotWrapper}>
          <Pivot 
          defaultSelectedKey={"0"}
          linkFormat={PivotLinkFormat.tabs}
          linkSize={PivotLinkSize.large}
          styles={pivotStyles}
          >
            <PivotItem 
             headerText="Pågående"
             itemKey="Pågående"
             >
            <div className={styles.pivotItems}>
            {    
            renderOngoingProjects()
            }
            </div>
              
              </PivotItem>
             <PivotItem 
             headerText="Avslutade"        
             itemKey="Avslutade"
             >
              <div className={styles.pivotItems}>
              {
                renderCompletedProjects()
              }
              </div>
             </PivotItem>
      </Pivot>
      </div>
     </div>
    </React.Fragment>)
}


export default AllProjects;