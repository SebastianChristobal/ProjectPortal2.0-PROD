import * as React from "react";
import { IControlPointsProps } from "./IControlPointsProps";
import { useState, useEffect } from "react";
import {
  DocumentCard,
  DocumentCardDetails,
  DocumentCardTitle,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  // IPivotStyles,
} from "office-ui-fabric-react";
import { spfi, SPFx } from "@pnp/sp";
import styles from "../../Activities.module.scss";
import * as moment from "moment";

import {
  PrimaryButton,
  // Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { IControlPoints } from "../../../Models/IControlPoints";
const ControlPoints: React.FC<IControlPointsProps> = (props) => {
  const sp = spfi().using(SPFx(props.context));
  const [ongoingControlpoints, setOngoingControlpoints] = useState([]);
  const [completedControlpoints, setCompletedControlpoints] = useState([]);
  const [selectedControlPointItem, setSelectedControlPointItem] =useState<IControlPoints>({});
  const [updateListItems, setUpdateListItems] = useState(null);

  const onUpdateControlPointDone = (control: IControlPoints): void => {
    const upDateData = async (): Promise<any> => {
      try {
        await sp.web.lists
          .getByTitle("Control")
          .items.getById(control.Id)
          .update({
            isDone: true,
          });
      } catch (err) {
        console.error(err);
      }
    };
    setUpdateListItems(true);
    upDateData().catch((err) => {
      console.error(err);
    });
  };

  const getSelectedControlPointItem = (selectedItem: IControlPoints): void => {
    setSelectedControlPointItem(selectedItem);
  };

  useEffect(() => {
    const fetchControlPointsData = async (): Promise<any> => {
      try {
        const controlItems = await sp.web.lists
          .getByTitle("Control")
          .items.select(
            "Id",
            "Title",
            "Projekt/Title",
            "Projekt/ID",
            "ControlType",
            "Description",
            "Date",
            "isDone",
            "ImplementedBy/Title",
            "ImplementedBy/ID"
          )
          .expand("Projekt", "ImplementedBy")
          .orderBy("Modified", true)
          .getAll();
        const ongoingControlPoints = controlItems.map((control: any) => ({
          Id: control.Id,
          Projekt: control.Projekt.Title,
          Title: control.Title,
          Description: control.Description,
          ControlType: control.ControlType,
          Date: moment(control.Date).format("YYYY-MM-DD"),
          isDone: control.isDone,
          ImplementedBy: control.ImplementedBy.Title
        })).filter((item: any) => item.isDone !== true);

        const completedControlPoints = controlItems.map((control: any) => ({
          Id: control.Id,
          Title: control.Title,
          Projekt: control.Projekt.Title,
          Description: control.Description,
          ControlType: control.ControlType,
          Date: moment(control.Date).format("YYYY-MM-DD"),
          isDone: control.isDone,
          ImplementedBy: control.ImplementedBy.Title
        })).filter((item: any) => item.isDone === true);

        setUpdateListItems(false);
        setOngoingControlpoints(ongoingControlPoints);
        setCompletedControlpoints(completedControlPoints)
      } catch (error) {
        console.error(error);
      }
    };
    fetchControlPointsData().catch((err) => {
      console.error(err);
    });
  }, [updateListItems]);

  console.log(selectedControlPointItem);

  const renderOngoingControlpoints = () => {  
    const controlpoints : any = ongoingControlpoints.length > 0 ? ongoingControlpoints.map((items: IControlPoints) =>{
      const controlpointTitle = `Rubrik: ${items.Title}`;
      const controlpointProject = `Projekt: ${items.Projekt}`;
      const controlpointControlType = `Kontrolltyp: ${items.ControlType}`
      const controlpointImplementedBy = `Genomförd av: ${items.ImplementedBy}`;
      const controlpointDate = `Datum: ${items.StartDate}`;
      const controlpointDescription = `Beskrivning: ${items.Description}`;
      const isDone: boolean = items.isDone;
      const onShowButtonText = "Visa";
      const buttonText = isDone === true ? "Klarmarkerad" : "Klarmarkera";
      return(<DocumentCard
        key={items.Id}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails  >        
        <DocumentCardTitle title={controlpointTitle} className={styles.cardTitle} />
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointProject}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointControlType}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointImplementedBy}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointDate}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointDescription}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={items.isDone}
                text={buttonText}
                onClick={() => onUpdateControlPointDone(items)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedControlPointItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>)
      
    }) : null;
    return controlpoints;
  };

  
  const renderCompletedControlpoints = () => {  
    const controlpoints : any = completedControlpoints.length > 0 ? completedControlpoints.map((items: IControlPoints) =>{
      const controlpointTitle = `Rubrik: ${items.Title}`;
      const controlpointProject = `Projekt: ${items.Projekt}`;
      const controlpointControlType = `Kontrolltyp: ${items.ControlType}`
      const controlpointImplementedBy = `Genomförd av: ${items.ImplementedBy}`;
      const controlpointDate = `Datum: ${items.StartDate}`;
      const controlpointDescription = `Beskrivning: ${items.Description}`;
      const isDone: boolean = items.isDone;
      const onShowButtonText = "Visa";
      const buttonText = isDone === true ? "Klarmarkerad" : "Klarmarkera";
      return(<DocumentCard
        key={items.Id}
        type={DocumentCardType.compact}
       // onClick={() => this.onOpenPanelHandler(items)}
        style={{
          maxWidth: '100%',
          height: '100%',
          marginTop: '15px',
          padding: '5px'
        }}
      >
        <DocumentCardDetails  >        
        <DocumentCardTitle title={controlpointTitle} className={styles.cardTitle} />
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointProject}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointControlType}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointImplementedBy}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointDate}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{controlpointDescription}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={items.isDone}
                text={buttonText}
                onClick={() => onUpdateControlPointDone(items)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedControlPointItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>)
      
    }) : null;
    return controlpoints;
  };

  return <div>     
       <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
      >
        <PivotItem headerText="Pågående" itemKey="ongoing">
          {ongoingControlpoints.length > 0 ? <div
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
      </Pivot>
</div>;
};

export default ControlPoints;
