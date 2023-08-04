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
// import styles from './ProjectPortal.module.scss';
import { IMyProjectsProps } from "./IMyProjectsProps";
import { IProject } from "../Models";
//import { ProjectService } from '../services/';

const MyProject: React.FC<IMyProjectsProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
     const [myProjects, setmyProjects] = useState([]);

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
                    ProjectMembersId: projects.ProjectMembersId
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

console.log(myProjects);

    return (<div>Hej</div>);
}




export default MyProject;