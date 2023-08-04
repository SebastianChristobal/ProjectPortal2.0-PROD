import * as React from 'react';
import styles from './ProjectPortal.module.scss';
import { IProjectPortalProps } from './IProjectPortalProps';
import { 
   HashRouter,
   Route, 
  //  Link, 
  //  Switch, 
  //  Redirect 
  } from 'react-router-dom';
  import {
    Pivot, 
    PivotItem, 
    PivotLinkFormat, 
    PivotLinkSize
} from  'office-ui-fabric-react';
import NewProject from './NewProject/NewProject';
import Start from './Start/Start';
//import { initializeIcons } from '@uifabric/icons';
//import NewProject from './NewProject/NewProject';
//import NewProject from './NewProject/NewProject';


const ProjectPortal: React.FC<IProjectPortalProps> = (props: IProjectPortalProps) =>{
  const {SPHttpClient, context, siteAbsolutetUrl} = props;

  const handleLinkClick = (item: PivotItem):void =>{
    if(item.props.headerText === 'Start'){
      window.open(`#/`, "_self");
    }
    if(item.props.headerText === 'Registrera nytt projekt'){
      window.open(`#/newProject`, "_self");
    }
    if(item.props.headerText === 'Visa alla projekt'){
      window.open(`#/allProjects`, "_self");
    }
    if(item.props.headerText === 'Registrera ÄTA'){
      window.open(`#/registerATA`, "_self");
    }
    if(item.props.headerText === 'Registrera genomförd kontroll'){
      window.open(`#/RegisterCompletedControl`, "_self");
    }
  }

  return(
  <div className={styles.projectPortal}>
      <div className={styles.NavigationWrapper}>
      <Pivot 
          defaultSelectedKey={"0"}
          linkFormat={PivotLinkFormat.tabs}
          linkSize={PivotLinkSize.large}
          onLinkClick={ handleLinkClick }
          style={{textAlign: "center"}}
          styles={{ 
            link: {borderStyle:'solid', borderWidth:'1px', marginRight:'10px'},
            linkIsSelected: {borderStyle:'solid', borderWidth:'1px', borderColor:'black', marginRight:'10px'},
            linkContent: {padding:'0px 8px 0px 8px'}
            }}
          >
            <PivotItem 
             headerText="Start"
             itemKey="Start"
             />
             <PivotItem 
             headerText="Registrera nytt projekt"        
             itemKey="Registrera nytt projekt"
             />
             <PivotItem 
             headerText="Visa alla projekt"    
             itemKey="Visa alla projekt"
             />
             <PivotItem 
             headerText="Registrera ÄTA"        
             itemKey="Registrera ÄTA"
             />
            <PivotItem 
             headerText="Registrera genomförd kontroll"        
             itemKey="Registrera genomförd kontroll"
             />
      </Pivot>
      </div>
    <HashRouter>
      <Route exact path={'/'} render={(props: any) =>
          <Start {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
      <Route path={'/newProject/'} render={(props: any) =>
          <NewProject {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
    </HashRouter>
   
    {/* <NewProject {...this.props} /> */}
  </div>);
}




export default ProjectPortal;