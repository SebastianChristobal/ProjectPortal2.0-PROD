import * as React from "react";
import { IStartProps } from "./IStartProps";
import { Label } from "office-ui-fabric-react";
import styles from "../ProjectPortal.module.scss";
import MyProject from "../Projects/MyProjects/MyProjects";
import Todos from "../Todos/Activities";

const Start : React.FC<IStartProps> = (props: IStartProps) =>{
    return(<React.Fragment>
    <div className={styles.startPageWrapper}>
    <div className={styles.newProjectTopNav}>
            <div>
                <Label
                style={{fontSize:24, fontWeight: 600}}
                >
                Mina projekt och aktiviteter</Label>
            </div>
            <div className={styles.newProjectHeaderText}>
                <Label
                style={{fontSize:18, fontWeight: 400}}
                >
                    Här kan du se vilka projekt du är ägare av eller medlem i, du kan även se dina aktiviteter kopplade till projekten.
               </Label>
            </div>
        </div>
        <div className={styles.projectActivityWrapper}>
        <div className={styles.myProjectsColumn}>
            <MyProject {...props} />
        </div>
        <div className={styles.myActivitiesColumn}>
            <Todos {...props} />
        </div>
        </div>
    </div></React.Fragment>);
}


export default Start;