import * as React from "react";
import { IStartProps } from "./IStartProps";
import styles from "../ProjectPortal.module.scss";
import MyProject from "../MyProjects/MyProjects";
import MyActivities from "../MyActivities/MyActivities";

const Start : React.FC<IStartProps> = (props: IStartProps) =>{


    return(
    <div className={styles.startPageWrapper}>
        <div className={styles.myProjectsCol}>
            <MyProject {...props} />
        </div>
        <div className={styles.myActivitiesCol}>
            <MyActivities {...props} />
        </div>
    </div>);
}


export default Start;