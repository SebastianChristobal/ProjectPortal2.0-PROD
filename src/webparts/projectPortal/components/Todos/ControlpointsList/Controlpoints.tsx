import * as React from "react";
import { IControlPointsProps } from "./IControlPointsProps";
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
import { IControlPoints } from "../../Models/IControlPoints";
const ControlPoints: React.FC<IControlPointsProps> = (props) => {
  const sp = spfi().using(SPFx(props.context));
  const [controlslistColumns, setControlsListColumns] = useState<IColumn[]>([]);
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
    const controlListColumns = [
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
        name: "Genomförd av",
        fieldName: "ImplementedBy",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column5",
        name: "Kontrolltyp",
        fieldName: "ControlType",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column6",
        name: "Datum",
        fieldName: "Date",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
      },
      {
        key: "column7",
        name: "",
        fieldName: "isDone",
        minWidth: 100,
        maxWidth: 250,
        isResizable: true,
        onRender: (control: IControlPoints) => {
          const isDone: boolean = control.isDone;
          const onSaveButtonText =
            isDone === true ? "Klarmarkerad" : "Klarmarkera";
          const onShowButtonText = "Visa";
          return (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row-reverse",
              }}
            >
              <PrimaryButton
                // style={{width: '119px', marginTop:'5px', height: '25px'}}
                disabled={isDone}
                text={onSaveButtonText}
                onClick={() => onUpdateControlPointDone(control)}
              />
              <PrimaryButton
                style={{
                  float: "left",
                  width: "119px",
                  marginTop: "5px",
                  //   height: '25px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedControlPointItem(control)}
              />
            </div>
          );
        },
      },
    ];
    setControlsListColumns(controlListColumns);
  }, []);
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
          Title: control.Title,
          Description: control.Description,
          ControlType: control.ControlType,
          Date: moment(control.Date).format("YYYY-MM-DD"),
          isDone: control.isDone,
        })).filter(item => item.isDone !== true);

        const completedControlPoints = controlItems.map((control: any) => ({
          Id: control.Id,
          Title: control.Title,
          Description: control.Description,
          ControlType: control.ControlType,
          Date: moment(control.Date).format("YYYY-MM-DD"),
          isDone: control.isDone,
        })).filter(item => item.isDone === true);

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
         <DetailsList
            items={ongoingControlpoints}
            columns={controlslistColumns}
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
            items={completedControlpoints}
            columns={controlslistColumns}
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
</div>;
};

export default ControlPoints;
