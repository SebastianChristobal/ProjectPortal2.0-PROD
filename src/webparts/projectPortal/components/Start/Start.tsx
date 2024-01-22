import * as React from "react";
import { IStartProps } from "./IStartProps";
import { Label, PrimaryButton } from "office-ui-fabric-react";
import styles from "../ProjectPortal.module.scss";
import MyProject from "../Projects/MyProjects/MyProjects";
import Activities from "../Todos/Activities";
import { IIconProps } from '@fluentui/react';

const addIcon: IIconProps = { iconName: 'Add' };

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
               <div style={{float:'right', marginRight: '7px', height: '30px', marginBottom: '10px'}}>
                <PrimaryButton text="Nytt projekt" iconProps={addIcon} />
               </div>
            </div>
        </div>
        <div className={styles.projectActivityWrapper}>
        <div className={styles.myProjectsColumn}>
            <MyProject {...props} />
        </div>
        <div className={styles.myActivitiesColumn}>
        <Activities {...props} />
        </div>
        </div>
    </div></React.Fragment>);
}


export default Start;