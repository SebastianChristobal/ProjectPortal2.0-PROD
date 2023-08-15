import * as React from "react";
// import { 
//     useState, 
//     useEffect 
// } from "react";
// import { 
//     Dropdown, 
//     // IDropdownOption
//  } from '@fluentui/react/lib/Dropdown';
import { 
    PeoplePicker, 
    PrincipalType 
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";  
// import { IItemAddResult } from "@pnp/sp/items";
// import { spfi, SPFx } from "@pnp/sp";
// import {INewProjectProps} from './INewProjectProps';
import { TextField } from '@fluentui/react/lib/TextField';
//import { IOptions } from "../Models";
import { PrimaryButton, DefaultButton, Label } from "office-ui-fabric-react";
import { INewATAProps } from "./INewATA";

import styles from "../ProjectPortal.module.scss";

const NewATA: React.FC<INewATAProps> = (props) =>{
 

  return(<React.Fragment>
    <div className={styles.newProjectWrapper}>
        <div className={styles.newProjectTopNav}>
            <div>
                <Label
                style={{fontSize:24, fontWeight: 600}}
                >
                Registrera ÄTA (ändring, tillägg och avgående).</Label>
            </div>
            <div className={styles.newProjectHeaderText}>
                <Label
                style={{fontSize:18, fontWeight: 400}}
                >
                Använd formuläret nedan för att registrera en ändring, tillägg och avgående.
                </Label>
            </div>
        </div>
        <div className={styles.newProjectForm}>
        <TextField 
            label="Rubrik"
            // errorMessage="Error message" 
            required={true}
            // onChange={ _onTitleTextFieldChange }
             />
             <TextField 
               label="Kund"
               required={true}
            //    onChange={ _onCustomerTextFieldChange } 
             />
               {/* <Dropdown
                 placeholder="välj projekttyp"
                label="Projekttyp"
                options={ dropdownOptions }
                // onChange={ _onOptionsChange }
                required={true}
               // onChange={dropdownOpt}
            /> */}
            <PeoplePicker
              context={props.context}
              titleText="Projektledare"
              personSelectionLimit={1}
              //showtooltip={true}
              required={true}
            //   onChange={ _getProjectManager }
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
              required={true}
            //   onChange={ _getResponsibleManager }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
             <PeoplePicker
              context={props.context}
              titleText="Projektmedlemmar"
              personSelectionLimit={10}
              //showtooltip={true}
              required={true}
            //   onChange={ _getProjectMembers }
              //showHiddenInUI={false}
               principalTypes={[PrincipalType.User]}
            //defaultSelectedUsers={this.state.selectedUsers}
             resolveDelay={1000} 
             />
             <div className={styles.buttonWrapper}>
                <PrimaryButton 
                text="Skapa projekt"
                // onClick={ onSaveProject}
                />
                <DefaultButton
                text="Avbryt"
                />
             </div>
        </div>
        <div className={styles.newProjectInfoText}>
            <Label
             style={{fontSize:18, fontWeight: 400}}
            >
           Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.
            </Label>
        </div>
    </div>
    </React.Fragment>)
}



export default NewATA;