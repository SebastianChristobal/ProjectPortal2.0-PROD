import * as React from "react";
import { IATAProps } from "./IATAProps";
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
import styles from "../Todos.module.scss";
import {
  PrimaryButton,
  // Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { IATA } from "../../Models/IATA";

const ATA: React.FC<IATAProps> = (props) =>{

    const sp = spfi().using(SPFx(props.context));
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

      const getSelectedATAItem = (selectedItem: IATA): void => {
        setSelectedATAItem(selectedItem);
      };
    
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

  const renderOngoingATA = (): JSX.Element => {

     const ata: any = ongoingATA.length > 0 ? ongoingATA.map((items: IATA) =>{
      const ataTitle = `Rubrik: ${items.Title}`;
      const ataProject = `Projekt: ${items.Projekt}`;
      const ataCustomer = `Beställare: ${items.Customer}`
      const ataExtent = `Omfattning: ${items.Extent}`;
      const ataPrice = `Prissättning: ${items.Price}`;
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
        <DocumentCardTitle title={ataTitle} className={styles.cardTitle} />
        <span key={items.Id} className={styles.cardItemProperties}>{ataProject}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{ataCustomer}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{ataExtent}</span>
        <span key={items.Id} className={styles.cardItemProperties}>{ataPrice}</span>
        <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
        <PrimaryButton
                disabled={items.isDone}
                text={buttonText}
                onClick={() => onUpdateATADone(items)}
              />
              <PrimaryButton
                style={{
                  width: "119px",
                  marginTop: "5px",
                  marginLeft: '5px'
                }}
                disabled={false}
                text={onShowButtonText}
                onClick={() => getSelectedATAItem(items)}
              />
        </div>
        </DocumentCardDetails>
      </DocumentCard>)
      
    }) : null;
    return ata;
    }

   const renderCompletedATA = ():JSX.Element =>{
      const ata: any = completedATA.length > 0 ? completedATA.map((items: IATA) =>{
        const ataTitle = `Rubrik: ${items.Title}`;
        const ataProject = `Projekt: ${items.Projekt}`;
        const ataCustomer = `Beställare: ${items.Customer}`
        const ataExtent = `Omfattning: ${items.Extent}`;
        const ataPrice = `Prissättning: ${items.Price}`;
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
          <DocumentCardTitle title={ataTitle} className={styles.cardTitle} />
          <span key={items.Id} className={styles.cardItemProperties}>{ataProject}</span>
          <span key={items.Id} className={styles.cardItemProperties}>{ataCustomer}</span>
          <span key={items.Id} className={styles.cardItemProperties}>{ataExtent}</span>
          <span key={items.Id} className={styles.cardItemProperties}>{ataPrice}</span>
          <div style={{paddingLeft: '10px', paddingTop:'5px'}}>
          <PrimaryButton
                  disabled={items.isDone}
                  text={buttonText}
                  onClick={() => onUpdateATADone(items)}
                />
                <PrimaryButton
                  style={{
                    width: "119px",
                    marginTop: "5px",
                    marginLeft: '5px'
                  }}
                  disabled={false}
                  text={onShowButtonText}
                  onClick={() => getSelectedATAItem(items)}
                />
          </div>
          </DocumentCardDetails>
        </DocumentCard>)
        
      }) : null;
  
      return ata;
    }

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
         { renderOngoingATA() }
          </div> : <div style={{fontSize:'16px', paddingTop: '30px', paddingLeft:'10px', color: '#9b8f8f'}}>Inga aktiva ärenden...</div>}
        </PivotItem>
        <PivotItem headerText="Avslutade" itemKey="completed">
          <div
            style={{
              padding: 20,
              marginTop: 6,
            }}
          >
          { renderCompletedATA() }
          </div>
        </PivotItem>
      </Pivot>
    
    </div>;
}

export default ATA;