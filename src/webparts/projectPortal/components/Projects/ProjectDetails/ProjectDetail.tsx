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
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import '@pnp/graph/groups';
import "@pnp/graph/members";
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
import { IProjectDetailProps } from "./IProjectDetailProps";
import { Label } from "office-ui-fabric-react";
import styles from "./ProjectDetail.module.scss"
import { IProject } from "../../Models";
// const theme = getTheme();
// const { palette, fonts } = theme;

const iconClass = mergeStyles({
  fontSize: 17,
  height: 17,
  width: 15,
  marginLeft: '32px',
  marginRight: '30px'
});

const ProjectDetail: React.FC<IProjectDetailProps> = (props) =>{
    const sp = spfi().using(SPFx(props.context));
    //const [titleValue, setTitleValue] = useState<string>(''); 
    const [customerValue, setCustomerValue] = useState<string>('');  
    const [selectedProject, setSelectedProject] = useState<IProject>({});
    const [isOpen, setIsOpen] = useState(false);
    const [budgetstatusOptions, setBudgetstatusOptions] = useState<IDropdownOption[]>([]);
    const [timeStatusOptions, setTimeStatusOptions] = useState<IDropdownOption[]>([]);
    const [resourcesStatusOptions, setResourcesStatusOptions] = useState<IDropdownOption[]>([]);
    //const [optBudgetValue, setOptBudgetValue] = useState<any>('');
    //const [optTimeValue, setOptTimeValue] = useState<any>('');
    //const [optResourcesValue, setOptResourcesValue] = useState<any>('');
    const [optBudgetKey, setOptBudgetKey] = useState<any>(null);
    const [optResourcesKey, setOptResourcesKey] = useState<any>(null);
    const [optTimeKey, setOptTimeKey] = useState<any>(null);
   
    // const _onTitleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
    //   setTitleValue(newValue);
    // }
    const _onCustomerTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void =>{
      setCustomerValue(newValue);
    }
    const editSelectedProject = (): void => {
      setIsOpen(true)
    }
    const dismissPanel = (): void => {
      setIsOpen(false);
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
    const fetchSelectedProject = async (): Promise<any> => {
      try {
          const currentUrl = window.location.href.split('/');
          const projectId = parseInt(currentUrl[currentUrl.length - 1]);
          const selectedProject = await sp.web.lists.getByTitle("Projekt").items.getById(projectId).select(
            'Id',    
            'Title', 
            'ProjectType/Title',
            'ProjectType/ID',
            'Customer',
            'ProjectManager/Title',
            'ProjectMembers/Title',
            'ProjectMembers/ID',
            'ProjectManager/ID',
            'ProjectLeader/Title',
            'ProjectLeader/ID',
            'ProjectImage',
            'Status',
            'Budget',
            'Resources',
            'Time'
            )
            .expand('ProjectManager', 'ProjectLeader', 'ProjectType', 'ProjectMembers')();
           setSelectedProject(selectedProject);
          }
        catch (error) {
          console.error(error);
   }
  };
    
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

   const renderSelectedProject = ():JSX.Element =>{
    if(selectedProject.Title !== undefined){
      const projectMembers = selectedProject.ProjectMembers.map((members: any) => {return members.Title});
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

   const renderProjectImage = (): JSX.Element =>{
    if(selectedProject.ProjectImage !== undefined){
      return <img width={'100%'} height={'100%'} src={selectedProject.ProjectImage} />
    }
   }
   const getStatusKey = (status: any): any => { 
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
  
   
   const getStatusColor = (status: any): any => { 
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

console.log(selectedProject);
console.log(optBudgetKey);
return(<React.Fragment>
      <div className={styles.ProjectDetailsPage}>
        {
           <Panel
           isOpen={isOpen}
           onDismiss={dismissPanel}
           type={PanelType.smallFixedFar}
           //customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined}
           closeButtonAriaLabel="Stäng"
           headerText="Redigera"
         >
            <TextField 
             label="Kund"
             // errorMessage="Error message" 
             value={ customerValue !== '' ? customerValue : selectedProject.Customer  }
             required={false}
             disabled={true}
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
                disabled={true}
                //defaultValue={optBudgetValue !== '' ? optBudgetValue : selectedProject.Budget}
            />
               <Dropdown
               // placeholder="Välj status"
                label="Tid"
                options={ timeStatusOptions }
                onChange={ _onTimeStatusOptionsChange }
                required={false}
                selectedKey={optTimeKey}
                disabled={true}
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
                disabled={true}
                defaultSelectedKey={optResourcesKey !== null ? optResourcesKey : getStatusKey(selectedProject.Resources)}
                //defaultValue={optResourcesValue !== '' ? optResourcesValue : selectedProject.Resources}
            />
           {/* <p>
             Select this size using <code>{`type={PanelType.${PanelType[panelType]}}`}</code>.
           </p> */}
         </Panel>
        }
         <div className={styles.projectDetailsAndFasWrapper}>
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
            knappar
            </div>
            <div className={styles.projectListItemsAndDocWrapper}>
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
            </div>
        </div></React.Fragment>);
}



export default ProjectDetail;