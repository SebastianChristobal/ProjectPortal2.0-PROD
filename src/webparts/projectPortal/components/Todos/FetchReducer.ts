
interface FetchState {
    loading?: boolean;
    error?: boolean;
    fetchProjects?: any;
    fetchActivities?: any; // You should replace 'any' with the actual type of your post object
}
 
 export const INITIAL_PROJECT_STATE = {
    loading: false,
    error: false,
    fetchProjects: {},
}
export const INITIAL_ACTIVITIES_STATE = {
    loading: false,
    error: false,
    fetchActivities: {},
}


export const fetchProjectReducer = (state: FetchState,  action: any): FetchState =>{
    switch(action.type){
    case "FETCH_START":
        return {
            loading: false,
            error: false,
            fetchProjects: {}
        };
    case "FETCH_PROJECTS_SUCCESS":
        return {
            ...state,
            loading: false,
            fetchProjects: action.payload
            }    
     case "FETCH_ERROR":
        return {
            loading: true,
            error: false,
            fetchProjects: {}
        }
    default:
        return state;

}
}
export const fetchActivityReducer = (state: FetchState,  action: any): FetchState =>{
    switch(action.type){
    case "FETCH_START":
        return {
            loading: false,
            error: false,
            fetchProjects: {}
        };
    case "FETCH_ACTIVITY_SUCCESS":
        return {
            ...state,
            loading: false,
            fetchProjects: action.payload
            }    
     case "FETCH_ERROR":
        return {
            loading: true,
            error: false,
            fetchProjects: {}
        }
    default:
        return state;

}
}
