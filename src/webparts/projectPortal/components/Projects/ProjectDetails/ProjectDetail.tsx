import * as React from "react";
import { useState, useEffect } from "react";
import {
    DocumentCard,
    DocumentCardDetails,
    DocumentCardTitle,
    DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import { TextField } from '@fluentui/react/lib/TextField';
// import { getTheme } from '@fluentui/react/lib/Styling';
// import {
//     PrimaryButton,
//     // Label,
//     // DefaultButton
//   } from "office-ui-fabric-react";
import { ProgressStepsIndicator } from '@pnp/spfx-controls-react/lib/ProgressStepsIndicator';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import '@pnp/graph/groups';
import "@pnp/graph/members";
import { IItemAddResult } from "@pnp/sp/items";
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
//import { graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/graph/teams";
import { 
  Dropdown, 
  IDropdownOption
} from '@fluentui/react/lib/Dropdown';
import { spfi, SPFx,  } from "@pnp/sp";
import { 
  PeoplePicker, 
  PrincipalType 
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { IProjectDetailProps } from "./IProjectDetailProps";
import {
   DefaultButton, 
  //  Label, 
   PrimaryButton
   } from "office-ui-fabric-react";
import styles from "./ProjectDetail.module.scss"
import { IProject, IUser } from "../../Models";
import { IStep } from "../../Models/IStep";
// const theme = getTheme();
// const { palette, fonts } = theme;
import PnPTelemetry from "@pnp/telemetry-js";
const telemetry = PnPTelemetry.getInstance();
telemetry.optOut();

const iconClass = mergeStyles({
  fontSize: 22,
  height: 17,
  width: 15,
  marginLeft: '32px',
  marginRight: '30px'
});
const buttonStyles = { root: { marginRight: 8 } };


const ProjectDetail: React.FC<IProjectDetailProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    const [customerValue, setCustomerValue] = useState<string>('');  
    const [selectedProject, setSelectedProject] = useState<IProject>({});
    const [isOpen, setIsOpen] = useState(false);
    const [budgetstatusOptions, setBudgetstatusOptions] = useState<IDropdownOption[]>([]);
    const [timeStatusOptions, setTimeStatusOptions] = useState<IDropdownOption[]>([]);
    const [resourcesStatusOptions, setResourcesStatusOptions] = useState<IDropdownOption[]>([]);
    const [onDisableEdit, setOnDisableEdit] = useState(true);
    const [optBudgetKey, setOptBudgetKey] = useState(null);
    const [optResourcesKey, setOptResourcesKey] = useState(null);
    const [optTimeKey, setOptTimeKey] = useState(null);
    const [projectLeader, setProjectLeader] = useState([]);
    const [projectManager, setProjectManager] = useState([]);
    const [projectMember, setProjectMember] = useState([]);
    const [defaultProjectLeader, setDefaultProjectLeader] = useState<IUser>({});
    const [defaultProjectManager, setDefaultProjectManager] = useState<IUser>({});
    const [defaultMembers, setDefaultMembers] = useState<IUser[]>([]);
    const [progressSteps, setProgressSteps] = useState<IStep[]>([]);
    const _getProjectLeader = (props: IUser[]): void => {  setProjectLeader(props);}
    const _getProjectManager = (props: IUser[]): void => {  setProjectManager(props);}
    const _getProjectMembers = (props: IUser[]): void => {  setProjectMember(props);}
  
    const _onCustomerTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
      setCustomerValue(newValue);
    }
    const editSelectedProject = (): void => {
      setIsOpen(true)
    }
    const dismissPanel = (): void => {
      setOnDisableEdit(true);
      setIsOpen(false);
    }
    const onEnableEdit = (): void =>{
      setOnDisableEdit(false);
    }
    const _onTimeStatusOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
      //setOptTimeValue(option.text);
      setOptTimeKey(option.key);
  }
  const _onResourcesStatusOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    //setOptResourcesValue(option.text);
    setOptResourcesKey(option.key);
}
const _onBudgetStatusOptionsChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
  //setOptBudgetValue(option.text);
  setOptBudgetKey(option.key);
}

  const onSave = async ():Promise<any> =>{
    const projectId: number = selectedProject.Id;
    const leader: string =  projectLeader.length > 0 ? projectLeader[0].loginName.match(/[^|]+$/)[0] : defaultProjectLeader.EMail;
    const manager: string = projectManager.length > 0 ? projectManager[0].loginName.match(/[^|]+$/)[0] : defaultProjectManager.EMail;
    const members : string[] = projectMember.length > 0 ? projectMember[0].loginName.match(/[^|]+$/)[0]: defaultMembers.map((EMail) => {return EMail});
    const selectedProjectLeader = await sp.web.ensureUser(leader);
    const selectedProjectManager = await sp.web.ensureUser(manager);
    const projectMembers: number[] = [];
    members.map( async (loginName: string) => {
    const selectedProjectMembers = await sp.web.ensureUser(loginName);
    projectMembers.push(selectedProjectMembers.data.Id); // Push the Id into the array
  });
  
    const project: IProject ={
      Customer: customerValue,
      Budget: optBudgetKey,
      Resources: optResourcesKey,
      Time: optTimeKey,
      ProjectLeaderId: selectedProjectLeader.data.Id,
      ProjectManager: selectedProjectManager.data.Id,
      ProjectMembers: projectMembers

    }
    try{
      const iar: IItemAddResult = await sp.web.lists.getByTitle("Projekt").items.getById(projectId).update(project);
      console.log(iar);
    }
    catch (err) {console.error(err);}
  }
  const getDefualtUsers = (selectedProject: any): any =>{
    let projectLeader : IUser = {};
    let projectManager : IUser = {};
    let members: IUser[] = [];
    if(selectedProject !== undefined){
      projectLeader = selectedProject.ProjectLeader;
      projectManager = selectedProject.ProjectManager;
      members = selectedProject.ProjectMembers.map((member: any) => {return member});
    }
    else{
      console.log("selectedProject.Manager is undefined or null.");
    }
    setDefaultProjectLeader(projectLeader);
    setDefaultProjectManager(projectManager);
    setDefaultMembers(members);
    return;
  }
    const fetchSelectedProject = async (): Promise<IProject> => {
      try {
          const currentUrl = window.location.href.split('/');
          const projectId = parseInt(currentUrl[currentUrl.length - 1]);
          const selectedProject = await sp.web.lists.getByTitle("Projekt").items.getById(projectId).select(
            'Id',    
            'Title', 
            'ProjectType/Title',
            'ProjectType/ID',
            'Customer',         
            'ProjectManager/ID',
            'ProjectManager/Title',
            'ProjectManager/EMail',
            'ProjectMembers/ID',
            'ProjectMembers/Title',
            'ProjectMembers/EMail',
            'ProjectLeader/ID',
            'ProjectLeader/Title',
            'ProjectLeader/EMail',
            'ProjectImage',
            'Status',
            'Budget',
            'Resources',
            'Time'
            )
            .expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers')();
           setSelectedProject(selectedProject);
           getDefualtUsers(selectedProject);
          }
        catch (error) {
          console.error(error);
   }
    return;
  };

    const fetchProgressSteps = async (): Promise<any> =>{
      const progressSteps: IStep[] = [];
      try{
          const fas = await sp.web.lists.getByTitle('Faser').items.getAll();
          fas.map((item) =>{
            progressSteps.push({
              description: item.Description,
              title: item.Title
            })
          })
          setProgressSteps(progressSteps);
      }catch (error) {
        console.error(error);
      }
      return;
    } 
    
    useEffect(() => {
      fetchSelectedProject().catch((err) => {
            console.error(err);
        });
    }, []); 

    useEffect(() => {
      const options : IDropdownOption[] = [{ key: '1', text: 'Låg'   }, {  key: '2', text: 'Medel'}, {  key: '3', text: 'Hög'}]
      setBudgetstatusOptions(options);
      setTimeStatusOptions(options);
      setResourcesStatusOptions(options);
    }, []);

    useEffect(() => {
      fetchProgressSteps().catch((err) => {
        console.error(err);
    });
    }, []);

    const renderProjectImage = (): JSX.Element =>{
      if(selectedProject.ProjectImage !== undefined){
        return <img width={'100%'} height={'100%'} src={selectedProject.ProjectImage} />
      }
     }
   const renderSelectedProject = ():JSX.Element =>{
    if(selectedProject.Title !== undefined){
      const projectMembers = selectedProject.ProjectMembers.map((members: IUser) => {return members.Title});
      const selectedProjectLeader = `Projektledare: ${selectedProject.ProjectLeader.Title}`
      const selectedProjectManager = `Projektansvarig: ${selectedProject.ProjectManager.Title}`
      const selectedProjectMemebers = `Projektmedlemmar: ${projectMembers}`
      const selectedProjectType = `Projekttyp: ${selectedProject.ProjectType.Title}`
      const selectedProjectCustomer = `Kund: ${selectedProject.Customer}`

        return(<DocumentCard
            key={selectedProject.Id}
            type={DocumentCardType.compact}
           // onClick={() => this.onOpenPanelHandler(items)}
            style={{
              maxWidth: '100%',
              height: '100%',
              border: 'none'
            }}
          >
            <DocumentCardDetails styles={{root:{
              justifyContent: 'flex-start'
            }}}   >              
            <div style={{display:'flex', alignItems: 'center', minHeight: '40px' }}>
              <DocumentCardTitle 
              title={selectedProject.Title}
              className={styles.cardTitle} 
             />
            <FontIcon aria-label="OpenEnrollment" iconName="OpenEnrollment" className={iconClass}  onClick={editSelectedProject}/>
            </div>
            <span  className={styles.cardItemProperties}>{selectedProjectCustomer}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectType}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectLeader}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectManager}</span>
            <span  className={styles.cardItemProperties}>{selectedProjectMemebers}</span>
            </DocumentCardDetails>
          </DocumentCard>);
    }
   }

   const getStatusKey = (status: string): any => { 
    switch (status) {
      case 'Low':
        return '1';
      case 'Medium':
        return '2';
      case 'High':
        return '3';
      default:
        return '0'; // You can set a default color for other cases
    }
  };
   const getStatusColor = (status: string): any => { 
    switch (status) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'yellow';
      case 'High':
        return 'red';
      default:
        return 'gray'; // You can set a default color for other cases
    }
  };
   const renderProjectStatuses = (): JSX.Element =>{
    if (selectedProject.Title !== undefined) {
      return (
        <React.Fragment>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', padding:'20px 1px 1px 20px'}}>
            <div style={{minWidth: '70px'}}>Budget</div>
            <div style={{ backgroundColor: getStatusColor(selectedProject.Budget), width: '15px', height: '15px', borderRadius: '10px' }} />
          </div>
          <div style={{width: '100%', display: 'flex', alignItems: 'center',  padding:'20px 1px 1px 20px' }}>
          <div style={{minWidth: '70px'}}>Tid</div>
            <div  style={{ backgroundColor: getStatusColor(selectedProject.Time), width: '15px', height: '15px', borderRadius: '10px' }}/>
          </div>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', padding:'20px 1px 1px 20px' }}>
          <div style={{minWidth: '70px'}}>Resurser</div>
            <div style={{ backgroundColor: getStatusColor(selectedProject.Resources), width: '15px', height: '15px', borderRadius: '10px' }}/>
          </div>
        </React.Fragment>
      );
    }
   }
   const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        { !onDisableEdit && <PrimaryButton onClick={onSave} styles={buttonStyles}>
          Spara
        </PrimaryButton>}
        {onDisableEdit && <PrimaryButton text="Redigera" onClick={onEnableEdit} styles={buttonStyles} />}
        <DefaultButton onClick={dismissPanel}>Avbryt</DefaultButton>
      </div>
    ),
    [dismissPanel],
  );

return(<React.Fragment>
      <div className={styles.ProjectDetailsPage}>
        {
           <Panel
           isOpen={isOpen}
           onDismiss={dismissPanel}
           type={PanelType.largeFixed}
           //customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined}
           closeButtonAriaLabel="Stäng"
           headerText="Redigera"
           onRenderFooterContent={onRenderFooterContent}
         >
            <TextField 
             label="Kund"
             // errorMessage="Error message" 
             defaultValue={customerValue !== '' ? customerValue : selectedProject.Customer}
             required={false}
             disabled={onDisableEdit}
             
             onChange={ _onCustomerTextFieldChange }
             />
                <Dropdown
                //placeholder="Välj status"
                label="Budget"
                options={ budgetstatusOptions }
                onChange={ _onBudgetStatusOptionsChange }
                required={false}
                defaultSelectedKey={optBudgetKey !== null ? optBudgetKey : getStatusKey(selectedProject.Budget)}
                selectedKey={optBudgetKey}
                disabled={onDisableEdit}
                //defaultValue={optBudgetValue !== '' ? optBudgetValue : selectedProject.Budget}
            />
               <Dropdown
               // placeholder="Välj status"
                label="Tid"
                options={ timeStatusOptions }
                onChange={ _onTimeStatusOptionsChange }
                required={false}
                selectedKey={optTimeKey}
                disabled={onDisableEdit}
                defaultSelectedKey={optTimeKey !== null ? optTimeKey : getStatusKey(selectedProject.Time)}
                //defaultValue={optTimeValue !== '' ? optTimeValue : selectedProject.Time}
            />
              <Dropdown
                //placeholder="Välj status"
                label="Resurser"
                options={ resourcesStatusOptions }
                onChange={ _onResourcesStatusOptionsChange }
                required={false}
                selectedKey={optResourcesKey}
                disabled={onDisableEdit}
                defaultSelectedKey={optResourcesKey !== null ? optResourcesKey : getStatusKey(selectedProject.Resources)}
                //defaultValue={optResourcesValue !== '' ? optResourcesValue : selectedProject.Resources}
            />
              <PeoplePicker
              context={props.context}
              titleText="Projektledare"
              personSelectionLimit={1}
              //showtooltip={true}
              disabled={onDisableEdit}
              required={true}
              onChange={ _getProjectLeader}
              defaultSelectedUsers={projectLeader.length > 0 ? projectLeader.map((user) => {return user.text}): [defaultProjectLeader.Title]}
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
               <PeoplePicker
              context={props.context}
              titleText="Projektansvarig"
              personSelectionLimit={1}
              //showtooltip={true}
              disabled={onDisableEdit}
              required={true}
              onChange={ _getProjectManager }
              defaultSelectedUsers={projectManager.length > 0 ? projectManager.map((user) => {return user.text}) : [defaultProjectManager.Title]}
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
              <PeoplePicker
              context={props.context}
              titleText="Projektmedlemmar"
              //personSelectionLimit={1}
              //showtooltip={true}
              disabled={onDisableEdit}
              required={true}
              onChange={ _getProjectMembers }
              defaultSelectedUsers={projectMember.length > 0 ? projectMember.map((user) => {return user.text}): defaultMembers.map((member) => {return member.Title})}
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
           {/* <p>
             Select this size using <code>{`type={PanelType.${PanelType[panelType]}}`}</code>.
           </p> */}
         </Panel>
        }
        <div className={styles.projectDetailsAndFasWrapper}>
         <div style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 5px 0px', width: '99%'}}>
          <div className={styles.projectDetailsWrapper}>
            <div className={styles.projectDetailColumnOne}>
                {renderSelectedProject()}
            </div>
             <div className={styles.projectDetailColumnTwo} >
                 {renderProjectStatuses()}
            </div>       
            <div className={styles.projectDetailColumnThree} >
                 {renderProjectImage()}
          </div>     
        </div >
         <div className={styles.projectFasWrapper}>
            <div style={{padding: '35px 30px 30px 35px'}}>
                {/* <Label style={{fontSize:18, fontWeight: 500}}>ProjektFaser</Label> */}
                <ProgressStepsIndicator steps={progressSteps} currentStep={1} themeVariant={props.themeVariant}    />
            </div>
          </div>
            </div>
          </div>  
          <div className={styles.projectDetailButtonsWrapper}>
            <div style={{ display: 'flex', flexFlow: 'column'}} >
            <PrimaryButton width={100} text="Registrera aktivitet"/>
            <PrimaryButton width={100} style={{marginTop: '5px'}}  text="Registrera kontrollpunkt"/>
            <PrimaryButton width={100} style={{marginTop: '5px'}}  text="Registrera ÄTA"/>
            </div>
          </div>
            {/* <div className={styles.projectListItemsAndDocWrapper}>
            <div className={styles.controllPointColumn}>
                    Kontrollpukter
            </div>
            <div className={styles.activityColumn}>
                    Items
            </div>
            <div className={styles.ataColumn}>
                    ÄTA
            </div>
            <div className={styles.documentColumn}>
                    Docs
            </div>
            </div> */}
        </div></React.Fragment>);
}



export default ProjectDetail;