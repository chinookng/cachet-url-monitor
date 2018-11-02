// Dependencies
const axios = require ('axios');
// const components = require('./components');
const components = require('./config.json');
const cachetCredentials = require('./cachetCredentials');

// let numInstanceSpinned = 0;
// let currentNumOfInstanceRunning = 0;

function validateComponent(component) {
    const {componentUrl, componentId, requestType, payload, componentName, checkInterval}  = component; 
    if (componentId && componentUrl && requestType && componentName && checkInterval){
        if(requestType.toLowerCase() == 'post' && !payload) {
        
            console.log(`The Component with url: ${componentUrl} has a requestType of post and as such must have a payload eg 
            payload:{
                component: value
            }`);
            return false;
        }
        else if(checkInterval <= 60000){
            console.log(`The Component with url: ${componentUrl} must have a setInterval greater than 45secs`);
            return false;
        } else {return true;} 
    }    
    else{
        console.log(`your component parameters are incomplete, check to make sure these 
parameters exist
    componentUrl
    componentId 
    requestType 
    setInterval
    payload
    componentName
        `);
        return false;
    }
};


// Checks Component Status and Updates Cachet as appropriate 
async function monitorNewComponent(component){
    const {componentUrl, componentId, componentName, requestType, payload}  = component;
    let status, //Holds the current status state of each component
        componentStatus,//The corresponding network status as specified by cachet
        componentMessage, //The accompanying network status message as specified by cachet
        statusText; //The status text from the network

    //----------- Header for the url or API query
   
    const http = axios.create({
        headers:{
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'token': '4a355e28766e915675555ed488f6f407',
        }, timeout: 60000
    });
    
   
    /* ------------- Query the url or API and return it's current network status---------------- */
            
            if(requestType.toLowerCase() == 'get' || requestType.toLowerCase() == 'delete'){
                try {
                    const res = await http.get(`${componentUrl}`); // 
                    status = res.status;
                    statusText = res.statusText;
                    // console.log(status);
                } catch (e) {
                    status = (e.response && e.response.status) || 500;
                    statusText = (e.response && e.response.statusText) || "Server not responding";
                    // console.log(error);
                }     
            } 
            else if ( requestType.toLowerCase() == 'post' || requestType.toLowerCase() == 'put' ){
                try {
                    const rec = await http.post(`${componentUrl}`, payload);
                    status = rec.status;
                    statusText = rec.statusText; 
                } catch (e) {
                    status = (e.response && e.response.status) || 500;
                    statusText = (e.response && e.response.statusText) || "Server not responding";
                    // console.log(error);
                }     
            }            

    /* ------------------ Assign Credentials Depending on network status ------------------ */
            // console.log(status);
    if ( status >= 200 && status < 400 ) { // 200 and 300 level Errors
        // console.log('gets here');
        componentStatus = 1;
        componentMessage = `The Component is Working`;
    }else if ( status === 400 || status === 401 ) {
        componentStatus =3;
        componentMessage = `The Component may not be working for everbody`;
    }else if ( status == 404 ) {
        componentStatus = 4;
        componentMessage = `The Component is not working for everybody`;
    }else{ // 500 or unknown Error
        componentStatus = 2;
        componentMessage = `The Component is experiencing some slowness`;
    }
    // console.log(componentStatus);

    /* -------------- Check the current network status of the component in the cachet API ----*/
    

    const client = axios.create({
        headers: cachetCredentials.headers
    });

     const response = await client.get(`${cachetCredentials.baseUrl}components/${componentId}`);
     let queryCachet = response.data.data.status;
        //   console.log(`${componentName} from cachet:${queryCachet}`);
        //   console.log(`${componentName} from Network:${componentStatus}`);

            if (componentStatus == queryCachet) return;

         /*----- Update the Component if the current cachet status and network status don't Match ---*/
      
          const body = {
                'status':status,
                'component_id': componentId,
                'component_status': componentStatus,
                'name': statusText,
                'message':componentMessage
            }


            // console.log(cachetCredentials.cachetUrl, body, cachetCredentials.headers);

            
            try {
                await client.post(`${cachetCredentials.baseUrl}incidents`, body);
                // currentNumOfInstanceRunning--;
                // console.log('done');

            } catch (e) {
                // console.log(e);
            }
 };

for (const component of components.components) {
    // console.log(component.componentUrl);
    //checks to make sure the component has the proper values
    let isValid = validateComponent(component);
    if(isValid == false) return;

    setInterval(() => {
        // currentNumOfInstanceRunning++;
        // numInstanceSpinned++;
       monitorNewComponent(component); 
    },component.checkInterval);   
}


// Handling rejection erros
    process.on('unhandledRejection', (e) => { 
        // console.error(e.message);
        process.exit(1);
    });

 