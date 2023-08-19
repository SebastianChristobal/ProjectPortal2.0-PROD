import * as React from "react";

import { useState, useEffect } from "react";
import {
    DetailsList,
    SelectionMode,
    IColumn,
  } from "@fluentui/react/lib/DetailsList";
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
import * as moment from "moment";
import {
  PrimaryButton,
  // Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { IActivityProps } from "./IActivityProps";
import { IActivity } from "../../Models/IActivity";


const Activity: React.FC<IActivityProps> = (props) =>{
 const sp = spfi().using(SPFx(props.context));
 const [ongoingActivities, setOngoingActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
 const [activitieslistColumns, setActivitiesListColumns] = useState<IColumn[]>([]);
 const [updateListItems, setUpdateListItems] = useState(null);
 const [selectedActivityItem, setSelectedActivityItem] = useState<IActivity>({});   
 const onUpdateActivityDone = (activity: IActivity): void => {
    const upDateData = async (): Promise<any> => {
      try {
        await sp.web.lists
          .getByTitle("Activity")
          .items.getById(activity.Id)
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
  const getSelectedActivityItem = (selectedItem: IActivity): void => {
    setSelectedActivityItem(selectedItem);
  };
  useEffect(() => {
    const activitiesListColumns = [
      {
        key: "column1",
        name: "Rubrik",
        fieldName: "Title",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column2",
        name: "Projekt",
        fieldName: "Projekt",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column3",
        name: "Beskrivning",
        fieldName: "Description",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column4",
        name: "Ansvarig",
        fieldName: "Responsible",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column5",
        name: "Förfallodatum",
        fieldName: "DueDate",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column6",
        name: "",
        fieldName: "isDone",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
        onRender: (activity: IActivity) => {
          const isDone: boolean = activity.isDone;
          const onShowButtonText = "Visa";
          const buttonText = isDone === true ? "Klarmarkerad" : "Klarmarkera";
          return (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row-reverse",
              }}
            >
              <PrimaryButton
                disabled={isDone}
                text={buttonText}
                // style={{width: activity
                onClick={() => onUpdateActivityDone(activity)}
              />
              <PrimaryButton
                style={{
                  float: "left",
                  width: "119px",
                  marginTop: "5px",
                  // height: '25px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedActivityItem(activity)}
              />
            </div>
          );
        },
      },
    ];
    setActivitiesListColumns(activitiesListColumns);
  }, []);
  useEffect(() => {
    const fetchActivityData = async (): Promise<any> => {
      try {
        const activityItems = await sp.web.lists
          .getByTitle("Activity")
          .items.select(
            "Id",
            "Title",
            "Projekt/Title",
            "Projekt/ID",
            "Description",
            "DueDate",
            "isDone",
            "Responsible/Title",
            "Responsible/ID"
          )
          .expand("Projekt", "Responsible")
          .orderBy("Modified", true)
          .getAll();
        const ongoingActivities = activityItems.map((activity: any) => ({
          Id: activity.Id,
          Title: activity.Title,
          Description: activity.Description,
          DueDate: moment(activity.DueDate).format("YYYY-MM-DD"),
          Responsible: activity.Responsible.Title,
          Projekt: activity.Projekt.Title,
          isDone: activity.isDone,
        })).filter(item => item.isDone !== true);

        const completedActivities = activityItems.map((activity: any) => ({
          Id: activity.Id,
          Title: activity.Title,
          Description: activity.Description,
          DueDate: moment(activity.DueDate).format("YYYY-MM-DD"),
          Responsible: activity.Responsible.Title,
          Projekt: activity.Projekt.Title,
          isDone: activity.isDone,
        })).filter(item => item.isDone === true);
        
        setUpdateListItems(false);
        setCompletedActivities(completedActivities);
        setOngoingActivities(ongoingActivities);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivityData().catch((err) => {
      console.error(err);
    });
  }, [updateListItems]);

  console.log(selectedActivityItem);

 return( <div>
        <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
      >
        <PivotItem headerText="Pågående" itemKey="ongoing">
          {ongoingActivities.length > 0 ? <div
            style={{
              marginBottom: 40,
              padding: 20,
              marginTop: 6,
            }}
          >
          <DetailsList
            items={ongoingActivities}
            columns={activitieslistColumns}
            setKey="set"
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
            //onColumnHeaderContextMenu={(column: IColumn, ev: React.MouseEvent<HTMLElement>) => this._onColumnContextMenu(column, ev)}
            selectionMode={SelectionMode.none}
          />
          </div> : <div style={{fontSize:'16px', paddingTop: '30px', paddingLeft:'10px', color: '#9b8f8f'}}>Inga aktiva ärenden...</div>}
        </PivotItem>
        <PivotItem headerText="Avslutade" itemKey="completed">
          <div
            style={{
              padding: 20,
              marginTop: 6,
            }}
          >
            <DetailsList
            items={completedActivities}
            columns={activitieslistColumns}
            setKey="set"
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
            //onColumnHeaderContextMenu={(column: IColumn, ev: React.MouseEvent<HTMLElement>) => this._onColumnContextMenu(column, ev)}
            selectionMode={SelectionMode.none}
          />
          </div>
        </PivotItem>
      </Pivot>
  
  </div>);
}




export default Activity;