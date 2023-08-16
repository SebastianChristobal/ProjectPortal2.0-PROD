
export interface IActivity{
    Id?: number;
    Title?: string;
    ActivityType?: string;
    Projekt?: any;
    ProjektTitle?: string;
    ProjektId?: string;
    isDone?: boolean;
    Description?: string;
    Responsible?: any;
    ResponsibleId?: any; 
    DueDate?: Date;
}