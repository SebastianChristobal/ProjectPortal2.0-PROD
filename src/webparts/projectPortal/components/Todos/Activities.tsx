import * as React from "react";
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  IPivotStyles,
} from "office-ui-fabric-react";
import {
  Label,
  // DefaultButton
} from "office-ui-fabric-react";
import { ActivitiesProps } from "./ActivitiesProps";
import Todos from "./ActivityControlpoints/TodosList/Todos";
//import ControlPoints from "./Controlpoints/ControlpointsList/Controlpoints";
import ATA from "./ATA/ATAList/ATA";

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
            }}
          
          >
            {<Todos {...props} />}
          </div>
        </PivotItem>
        {/* <PivotItem headerText="Mina Kontrollpunkter" itemKey="myControlPoints">
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px 0px",
              padding: 20,
              marginTop: 6,
            }}
          >
            {<ControlPoints {...props} />}
          </div>
        </PivotItem> */}
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
