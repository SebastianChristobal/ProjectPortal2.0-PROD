import * as React from 'react';
import { IAllProjectsProps } from './IAllProjectsProps';
import { 
    Label
   } from "office-ui-fabric-react";
import styles from "../ProjectPortal.module.scss";

const AllProjects : React.FC<IAllProjectsProps> = (props) =>{


    return(<React.Fragment>
        <div className={styles.newProjectWrapper}>
            <div className={styles.newProjectTopNav}>
                <div>
                    <Label
                    style={{fontSize:24, fontWeight: 600}}
                    >
                    Här kan vi se alla Projekt som har skapats.</Label>
                </div>
                <div className={styles.newProjectHeaderText}>
                    <Label
                    style={{fontSize:18, fontWeight: 400}}
                    >
                    Använd formuläret nedan för att registrera en ändring, tillägg och avgående.
                    </Label>
                </div>
            </div>
            <div className={styles.newProjectForm}>
                TEST 
            </div>
            <div className={styles.newProjectInfoText}>
                <Label
                 style={{fontSize:18, fontWeight: 400}}
                >
               Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.
                </Label>
            </div>
        </div>
        </React.Fragment>)

}


export default AllProjects;