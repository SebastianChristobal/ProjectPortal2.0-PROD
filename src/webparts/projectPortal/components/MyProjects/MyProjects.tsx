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
          marginBottom: '10px',
          maxWidth: '320px',
          minWidth: '180px',
          width: '100%',
        },
      };

     useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try {
                const currentUser = await sp.web.currentUser();
                const items = await sp.web.lists.getByTitle("Projekt").items();
                const myProjects = items.map((projects: IProject) => ({  
                    Id: projects.Id, 
                    Title: projects.Title,
                    Customer: projects.Customer,
                    ProjectManagerId: projects.ProjectManagerId,
                    ProjectLeaderId: projects.ProjectLeaderId,
                    ProjectMembersId: projects.ProjectMembersId,
                    ProjectImage: projects.ProjectImage
                })).filter((project: IProject) =>
                project.ProjectLeaderId === currentUser.Id ||
                project.ProjectMembersId.includes(currentUser.Id) ||
                project.ProjectMembersId.includes(currentUser.Id) ||
                project.ProjectMembersId.includes(currentUser.Id)
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

    const renderMyProjects = myProjects.map((project: IProject) =>{
     // const projectimage: any = project.ProjectImage !== '' ? oneNoteIconProps : '';
        return(<DocumentCard
            key={project.Id}
            aria-label={
              'Document Card with icon. How to make a good design. ' +
              'Last modified by Christian Bergqvist in January 1, 2019.'
            }
            styles={cardStyles}
            onClickHref="http://bing.com"
          >
            <div className={styles.imageWrapper}>
            <DocumentCardImage height={150}  imageFit={ImageFit.cover} imageSrc={project.ProjectImage}  />
            </div>
            <DocumentCardDetails>
              <DocumentCardTitle title={project.Title} shouldTruncate />
            </DocumentCardDetails>
            
          </DocumentCard>)
    });

    return(<React.Fragment>
        <Label
        style={{fontSize:20, fontWeight: 500, marginBottom:10}}
        >
        Mina projekt
        </Label>
        <div className={styles.myProjects}>{ renderMyProjects }</div>
    </React.Fragment>);
}

export default MyProject;