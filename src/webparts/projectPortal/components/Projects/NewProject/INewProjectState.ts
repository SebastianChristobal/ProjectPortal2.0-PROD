import {  IDropdownOption } from '@fluentui/react/lib/Dropdown';
//import { IChoices } from "../Models";

export interface INewProjectState {
    dropdownOptions: IDropdownOption[];
    userDetails: IUserDetail[];
    selectedUsers: string[];
}

export interface IUserDetail {
    ID?: any;
    LoginName?: string;
    Title?: string;
    secondaryText?: any;
  }