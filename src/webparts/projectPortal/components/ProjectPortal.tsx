import * as React from 'react';
import styles from './ProjectPortal.module.scss';
import { IProjectPortalProps } from './IProjectPortalProps';
//import NewProject from './NewProject/NewProject';
import ProjectNew from './NewProject/ProjectNew';

export default class ProjectPortal extends React.Component<IProjectPortalProps, {}> {
  public render(): React.ReactElement<IProjectPortalProps> {

    return (
      <div className={styles.projectPortal}>
        {/* <NewProject {...this.props} /> */}
        <ProjectNew {...this.props} />
      </div>
    );
  }
}
