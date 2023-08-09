export interface IProject{
    Id?: string;
    Title?: string;
    ProjectType?: string;
    ProjectTypeId?: number;
    ProjectLeader?:string;
    ProjectLeaderId?: number;
    ProjectManagerId?: number;
    ProjectManager?:string;
    ProjectMembersId?: any;
    ProjectMembers?:string;
    ProjectNumberId?: number;
    Customer?: string;
    ProjectImage?: string;
}