# cachet-url-monitor

Basic Setup
-----------
### config.json

 > __baseUrl__: Specifies the base url of your cachet server.

 > __token__: Specifies your cachet token. Can be found in your cachet profile settings page on admin dashboard.

 > __timezone__: Specifies your default timezone. Must be same as set on cachet.

 > __components__: an array of objects. The objects been the components been monitored with properties as listed below.

 > __componentId__: Specifies the id of the component to be monitored.

 > __componentUrl__: Specifies the url of the component to be monitored(Always include the trailing backslash).

 > __componentName__: Must be same as on the Cachet Status page.

 > __checkInterval__: Specifies the time in milliseconds after which another check will occur.

 > __payload__: This must be specified only for a post requestType.
 

 ### cachetCredentials.js
 > __headers__: You can set headers for your connection here. The major ones have already been set.