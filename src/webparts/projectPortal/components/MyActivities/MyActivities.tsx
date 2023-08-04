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
import { IMyActivitiesProps } from "./IMyActivitiesProps";


const MyActivities: React.FC<IMyActivitiesProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));

    const [myActivities, setMyActivities] = useState([]);

    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try {
                const items = await sp.web.lists.getByTitle("Activity").items();
                const myActivities = items.map((activity: any) => ({
                    Title: activity.Title
                }));
                setMyActivities(myActivities);
                }
                catch (error) {
                    console.error(error);
                }
        };

        fetchData().catch((err) => {
            console.error(err);
        });
    }, []); 
    console.log(myActivities);
  
    return (<div>Mina aktiviteter</div>);
}




export default MyActivities;