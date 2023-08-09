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
import { Image, IImageProps } from '@fluentui/react/lib/Image';
import NewProject from './NewProject/NewProject';
import Start from './Start/Start';
//import { initializeIcons } from '@uifabric/icons';
//import NewProject from './NewProject/NewProject';
//import NewProject from './NewProject/NewProject';


const ProjectPortal: React.FC<IProjectPortalProps> = (props: IProjectPortalProps) =>{
  const {SPHttpClient, context, siteAbsolutetUrl} = props;
  const imageProps: Partial<IImageProps> = {
    src: 'https://braverodev.sharepoint.com/sites/Projektportalen2.0/StartPageImage/portalImg.png',
    // Show a border around the image (just for demonstration purposes)
    styles: props => ({ root: { border: '1px solid ' + props.theme.palette.neutralSecondary } }),
  };
  
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
      window.open(`#/registreraATA`, "_self");
    }
    if(item.props.itemKey === 'RegisterCompletedControl'){
      window.open(`#/registreraKontroll`, "_self");
    }
  }

  return(
  <div className={styles.projectPortal}>
    <div className={styles.portalImage}>
    <Image {...imageProps} style={{ width :'100%', height: 'auto'}} alt="Example with no image fit value and no height or width is specified." />
    </div>
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
             itemKey="registerNewProject"
             />
             <PivotItem 
             headerText="Visa alla projekt"    
             itemKey="showAllProjects"
             />
             <PivotItem 
             headerText="Registrera ÄTA"        
             itemKey="registerATA"
             />
            <PivotItem 
             headerText="Registrera genomförd kontroll"        
             itemKey="RegisterCompletedControl"
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
    </HashRouter>
   
    {/* <NewProject {...this.props} /> */}
  </div>);
}




export default ProjectPortal;