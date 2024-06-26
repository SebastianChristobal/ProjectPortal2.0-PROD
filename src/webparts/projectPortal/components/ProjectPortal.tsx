import * as React from 'react';
import styles from './ProjectPortal.module.scss';
import { IProjectPortalProps } from './IProjectPortalProps';
import { 
   HashRouter,
   Route
  } from 'react-router-dom';
  import {
    Pivot, 
    PivotItem, 
    PivotLinkFormat, 
    PivotLinkSize
} from  'office-ui-fabric-react';
import NewProject from './Projects/NewProject/NewProject';
import Start from './Start/Start';
import ProjectDetail from './Projects/ProjectDetails/ProjectDetail';
import NewATA from './Todos/ATA/NewATA/NewATA';
import NewControlPoint from './Todos/ActivityControlpoints/NewControlPoint/NewControlPoint';
import AllProjects from './Projects/AllProjects/AllProjects';
import NewTodo from './Todos/ActivityControlpoints/NewActivity/NewActivity';

const ProjectPortal: React.FC<IProjectPortalProps> = (props: IProjectPortalProps) =>{
  const {SPHttpClient, context, siteAbsolutetUrl} = props;
 
  
  const handleLinkClick = (item: PivotItem):void =>{
    if(item.props.itemKey === 'Start'){
      window.open(`#/`, "_self");
    }
    if(item.props.itemKey === 'registerNewProject'){
      window.open(`#/nyttProjekt`, "_self");
    }
    if(item.props.itemKey === 'showAllProjects'){
      window.open(`#/allaProjekt`, "_self");
    }
    if(item.props.itemKey === 'registerATA'){
      window.open(`#/registeraATA`, "_self");
    }
    if(item.props.itemKey === 'RegisterCompletedControl'){
      window.open(`#/registreraKontrollPunkt`, "_self");
    }
    if(item.props.itemKey === 'registerActivity'){
      window.open(`#/registreraAktivitet`, "_self");
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
            link: {borderStyle:'solid', borderWidth:'1px',borderRadius: '4px', marginRight:'5px'},
            linkIsSelected: {borderStyle:'solid',borderRadius: '4px', borderWidth:'1px', borderColor:'black', marginRight:'5px'},
            linkContent: {padding:'0px 8px 0px 8px'}
            }}
          >
            <PivotItem 
             headerText="Start"
             itemKey="Start"
             />
             <PivotItem 
             headerText="Registrera nytt projekt"        
             itemKey="registerNewProject"
             />
             <PivotItem 
             headerText="Visa alla projekt"    
             itemKey="showAllProjects"
             />
              <PivotItem 
             headerText="Registrera aktivitet"        
             itemKey="registerActivity"
             />
              <PivotItem 
             headerText="Registrera kontroll"        
             itemKey="RegisterCompletedControl"
             />
             <PivotItem 
             headerText="Registrera ÄTA"        
             itemKey="registerATA"
             />
           
      </Pivot>
      </div>
    <HashRouter>
      <Route exact path={'/'} render={(props: any) =>
          <Start {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
      <Route path={'/nyttProjekt/'} render={(props: any) =>
          <NewProject {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
         <Route path={'/allaProjekt/'} render={(props: any) =>
          <AllProjects {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
         <Route path={'/registeraATA/'} render={(props: any) =>
        <NewATA {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
          <Route path={'/registreraKontrollPunkt/'} render={(props: any) =>
        <NewControlPoint {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
            <Route path={'/registreraAktivitet/'} render={(props: any) =>
        <NewTodo {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
      <Route path={'/ProjektDetaljer/:id'} render={(props: any) =>
        <ProjectDetail {...props} spHttpClient={SPHttpClient} spSiteUrl={siteAbsolutetUrl} context={context}  />
        } />
    </HashRouter>
   
    {/* <NewProject {...this.props} /> */}
  </div>);
}

export default ProjectPortal;