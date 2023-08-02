
const LIST_API_ENDPOINT: string = `/_api/web/lists/GetByTitle('ProjektTyp')/items`;

export  const fetchProjectTypes = async (absoluteSiteUrl: string):Promise<any>  =>{
    const selectQuery = '?$select=Title,Id';
    const query = `${absoluteSiteUrl}${LIST_API_ENDPOINT}${selectQuery}`;
    try{
           const rawResponse = await fetch(query, {
               headers: {
                   Accept: 'application/json',
                 },
               });
               if (!rawResponse.ok) {
                   throw new Error('Network response was not ok');
                 }
                 const data = await rawResponse.json().then((response: { value: any[]}) =>{
                 console.log(response.value);
                   return response.value;
                 });
                    
                 return data;
       }
       catch(err){
           console.error('Error fetching data:', err);
       }
};


