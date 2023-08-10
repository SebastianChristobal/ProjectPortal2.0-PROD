import * as React from "react";
import { IProjectDetailProps } from "./IProjectDetailProps";
import { Label } from "office-ui-fabric-react";
import styles from "./ProjectDetail.module.scss"


const ProjectDetail: React.FC<IProjectDetailProps> = (props) =>{

    return(<React.Fragment>
        <div className={styles.ProjectDetailsPage}>
            <div className={styles.projectDetailsAndFasWrapper}>
              <div className={styles.projectDetailsWrapper}>
                        <div>
                            <Label
                            style={{fontSize:18, fontWeight: 500}}
                            >
                            ProjektDetaljer</Label>
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
            <div>
                    <Label
                    style={{fontSize:18, fontWeight: 500}}
                    >
                    Knappar</Label>
                </div>
            </div>
            <div className={styles.projectListItemsAndDocWrapper}>
            <div>
                    <Label
                    style={{fontSize:18, fontWeight: 500}}
                    >
                    Listor och dokument</Label>
                </div>
            </div>
        </div></React.Fragment>);
}



export default ProjectDetail;