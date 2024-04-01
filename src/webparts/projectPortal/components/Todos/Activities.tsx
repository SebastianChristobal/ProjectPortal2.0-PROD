import * as React from "react";
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  IPivotStyles,
  DocumentCard,
  DocumentCardDetails,
  DocumentCardTitle,
  PrimaryButton,
  DocumentCardType
} from "office-ui-fabric-react";
import {
  Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { ActivitiesProps } from "./ActivitiesProps";
import styles from "./Activities.module.scss";
//import ControlPoints from "./Controlpoints/ControlpointsList/Controlpoints";
import ATA from "./ATA/ATAList/ATA";
import { DummyActivities, DummyControlpoints } from '../../DummyTodos';

const pivotStyles: Partial<IPivotStyles> = {
  // root: {
  //   display: "flex",
  //   flexWrap: "wrap",
  // },
  //   itemContainer: {
  //     backgroundColor: "#ABEBC6",
  //   },
  link: {
    borderStyle: "solid",
    borderWidth: "1px",
    marginRight: "7px",
    width: "auto",
    borderRadius: "5px 5px 0px 0px"
  },
  linkIsSelected: {
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "black",
    marginRight: "7px",
    width: "auto",
    borderRadius: "5px 5px 0px 0px"
  },
};

const Activities: React.FC<ActivitiesProps> = (props) => {
  

  const onShowButtonText = "Visa";
  const buttonText = "Klarmarkera";

 

  const renderOngoingActivities = (): JSX.Element => {
    const filteredActivities = DummyActivities.filter((activity) => activity.ongoing === true);
    const activities =  filteredActivities.map((activity) =>{
      return(<DocumentCard
        key={activity.projectId}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails>        
        <DocumentCardTitle title={activity.title} className={styles.cardTitle} />
        <span  className={styles.cardProjectTitle}>{activity.projectTitle}</span>
        <span  className={styles.cardContentType}>{activity.contentTypeName}</span>
        <span  className={styles.cardDesc}>{activity.description}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
               // disabled={items.isDone}
               text={buttonText}
              //  onClick={() => onActivityDone(items, project)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
               text={onShowButtonText}
                // onClick={() => getSelectedActivityItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>
    )})

    return (         
      <div>
       {activities}
      </div>)
  }
  const renderCompletedActivities = (): JSX.Element => {
    const filteredActivities = DummyActivities.filter((activity) => activity.ongoing === false);
    const activities =  filteredActivities.map((activity) =>{
      return(<DocumentCard
        key={activity.projectId}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails>        
        <DocumentCardTitle title={activity.title} className={styles.cardTitle} />
        <span  className={styles.cardProjectTitle}>{activity.projectTitle}</span>
        <span  className={styles.cardContentType}>{activity.contentTypeName}</span>
        <span  className={styles.cardDesc}>{activity.description}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
               disabled={true}
               text={buttonText}
              //  onClick={() => onActivityDone(items, project)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
               text={onShowButtonText}
                // onClick={() => getSelectedActivityItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>
    )})

    return (         
      <div>
       {activities}
      </div>)
  }
  const renderOngoingControlpoints = (): JSX.Element => {

    const ongoingControlpoints = DummyControlpoints.filter((control) => control.ongoing === true);
    const controlpoints = ongoingControlpoints.map((control) =>{
      return(<DocumentCard
        key={control.projectId}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails>        
        <DocumentCardTitle title={control.title} className={styles.cardTitle} />
        <span  className={styles.cardProjectTitle}>{control.projectTitle}</span>
        <span  className={styles.cardContentType}>{control.contentTypeName}</span>
        <span  className={styles.cardDesc}>{control.description}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
               // disabled={items.isDone}
               text={buttonText}
              //  onClick={() => onActivityDone(items, project)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
               text={onShowButtonText}
                // onClick={() => getSelectedActivityItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>
    )}) 
    return (         
      <div>
       {controlpoints}
      </div>)
  }
  const renderCompletedControlpoints = (): JSX.Element => {
    const completedControlpoints = DummyControlpoints.filter((control) => control.ongoing === false);
    const controlpoints = completedControlpoints.map((control) =>{
      return(<DocumentCard
        key={control.projectId}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails>        
        <DocumentCardTitle title={control.title} className={styles.cardTitle} />
        <span  className={styles.cardProjectTitle}>{control.projectTitle}</span>
        <span  className={styles.cardContentType}>{control.contentTypeName}</span>
        <span  className={styles.cardDesc}>{control.description}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={true}
               text={buttonText}
              //  onClick={() => onActivityDone(items, project)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
               text={onShowButtonText}
                // onClick={() => getSelectedActivityItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>
    )}) 
    return (         
      <div>
       {controlpoints}
      </div>)
  }

  const renderAllControlpoints = (): JSX.Element =>{
    return (<Pivot
      defaultSelectedKey={"0"}
      linkFormat={PivotLinkFormat.links}
      linkSize={PivotLinkSize.large}
    >
      <PivotItem headerText="Pågående" itemKey="ongoing">
        {ATA.length > 0 ? <div
          style={{
            marginBottom: 40,
            padding: 20,
            marginTop: 6,
          }}
        >
       { renderOngoingControlpoints() }
        </div> : <div style={{fontSize:'16px', paddingTop: '30px', paddingLeft:'10px', color: '#9b8f8f'}}>Inga aktiva ärenden...</div>}
      </PivotItem>
      <PivotItem headerText="Avslutade" itemKey="completed">
        <div
          style={{
            padding: 20,
            marginTop: 6,
          }}
        >
        { renderCompletedControlpoints() }
        </div>
      </PivotItem>
    </Pivot>)
    
  }

  const renderAllActivies = (): JSX.Element =>{
    return (<Pivot
      defaultSelectedKey={"0"}
      linkFormat={PivotLinkFormat.links}
      linkSize={PivotLinkSize.large}
    >
      <PivotItem headerText="Pågående" itemKey="ongoing">
        {ATA.length > 0 ? <div
          style={{
            marginBottom: 40,
            padding: 20,
            marginTop: 6,
          }}
        >
       { renderOngoingActivities() }
        </div> : <div style={{fontSize:'16px', paddingTop: '30px', paddingLeft:'10px', color: '#9b8f8f'}}>Inga aktiva ärenden...</div>}
      </PivotItem>
      <PivotItem headerText="Avslutade" itemKey="completed">
        <div
          style={{
            padding: 20,
            marginTop: 6,
          }}
        >
        { renderCompletedActivities() }
        </div>
      </PivotItem>
    </Pivot>)
  }


  return (
    <React.Fragment>
      <Label style={{ fontSize: 20, fontWeight: 500, marginBottom: 10 }}>
        Mina ärenden
      </Label>
      <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.tabs}
        linkSize={PivotLinkSize.large}
        styles={pivotStyles}
      >
        <PivotItem headerText="Mina aktiviteter" itemKey="myActivities">
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px 0px",
              marginBottom: 40,
              padding: 20,
              marginTop: 6,
            }}>
            { renderAllActivies() }
          </div>
        </PivotItem>
        <PivotItem headerText="Mina Kontrollpunkter" itemKey="myControlPoints">
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px 0px",
              padding: 20,
              marginTop: 6,
            }}
          >
           { renderAllControlpoints() }
          </div>
        </PivotItem>
        <PivotItem headerText="Mina ÄTA" itemKey="myATA">
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px 0px",
              padding: 20,
              marginTop: 6,
            }}
          >
            {<ATA {...props} />}
          </div>
        </PivotItem>
      </Pivot>
    </React.Fragment>
  );
};
export default Activities;
