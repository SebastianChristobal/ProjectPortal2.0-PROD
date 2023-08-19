import * as React from "react";
import { IATAProps } from "./IATAProps";
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

import {
  PrimaryButton,
  // Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { IATA } from "../../Models/IATA";

const ATA: React.FC<IATAProps> = (props) =>{

    const sp = spfi().using(SPFx(props.context));
    const [ATAlistColumns, setATAListColumns] = useState<IColumn[]>([]);
    const [ongoingATA, setOngoingATA] = useState([]);
    const [completedATA, setCompletedATA] = useState([]);
    const [selectedATAItem, setSelectedATAItem] =useState<IATA>({});
    const [updateListItems, setUpdateListItems] = useState(null);

    const onUpdateATADone = (ata: IATA): void => {
        const upDateData = async (): Promise<any> => {
          try {
            await sp.web.lists
              .getByTitle("ATA")
              .items.getById(ata.Id)  
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

      const getSelectedControlPointItem = (selectedItem: IATA): void => {
        setSelectedATAItem(selectedItem);
      };
    
      useEffect(() => {
        const ATAListColumns = [
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
            name: "Beställare",
            fieldName: "Customer",
            minWidth: 100,
            maxWidth: 250,
            isResizable: true,
          },
          {
            key: "column4",
            name: "Omfattning",
            fieldName: "Extent",
            minWidth: 100,
            maxWidth: 250,
            isResizable: true,
          },
          {
            key: "column5",
            name: "Prissättning",
            fieldName: "Price",
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
            onRender: (ata: IATA) => {
              const isDone: boolean = ata.isDone;
              const onSaveButtonText = isDone === true ? "Klarmarkerad" : "Klarmarkera";
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
                    style={{width: '119px', marginTop:'5px', height: '35px'}}
                   disabled={isDone}
                   text={onSaveButtonText}
                   onClick={() => onUpdateATADone(ata)}
                  />
                  <PrimaryButton
                    style={{
                      float: "left",
                      width: "119px",
                      marginTop: "5px",
                         height: '35px'
                    }}
                    disabled={false}
                    text={onShowButtonText}
                    onClick={() => getSelectedControlPointItem(ata)}
                  />
                </div>
              );
            },
          },
        ];
        setATAListColumns(ATAListColumns);
      }, []);

      useEffect(() => {
        const fetchControlPointsData = async (): Promise<any> => {
          try {
            const controlItems = await sp.web.lists
              .getByTitle("ATA")
              .items.select(
                "Id",
                "Title",
                "Projekt/Title",
                "Projekt/ID",
                "Customer",
                "Extent",
                "Price",
                "isDone"

              )
              .expand("Projekt")
              .orderBy("Modified", true)
              .getAll();
    
            const ongoingATA = controlItems.map((ata: any) => ({
              Id: ata.Id,
              Title: ata.Title,
              Projekt: ata.Projekt.Title,
              Customer: ata.Customer,
              Price: ata.Price,
              Extent: ata.Extent,
              isDone: ata.isDone
            })).filter(item => item.isDone !== true)

            const completedATA = controlItems.map((ata: any) => ({
              Id: ata.Id,
              Title: ata.Title,
              Projekt: ata.Projekt.Title,
              Customer: ata.Customer,
              Price: ata.Price,
              Extent: ata.Extent,
              isDone: ata.isDone
            })).filter(item => item.isDone === true);
            setUpdateListItems(false);
            setOngoingATA(ongoingATA);
            setCompletedATA(completedATA);
           
          } catch (error) {
            console.error(error);
          }
        };
        fetchControlPointsData().catch((err) => {
          console.error(err);
        });
      }, [updateListItems]);
      
      console.log(selectedATAItem);

      return<div>     
          <Pivot
        defaultSelectedKey={"0"}
        linkFormat={PivotLinkFormat.links}
        linkSize={PivotLinkSize.large}
      >
        <PivotItem headerText="Pågående" itemKey="ongoing">
          {ongoingATA.length > 0 ? <div
            style={{
              marginBottom: 40,
              padding: 20,
              marginTop: 6,
            }}
          >
          <DetailsList
            items={ongoingATA}
            columns={ATAlistColumns}
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
            items={completedATA}
            columns={ATAlistColumns}
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
}

export default ATA;