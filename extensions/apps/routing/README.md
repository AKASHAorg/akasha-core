# Routing App

> The Routing app serves as base for routing of all registered apps and widgets.
> It collects real-time data from single-spa about all registered apps, both world apps and user apps, uses their exported routing info to provide a data single source - which is then used to render menus (ie. sidebar and topbar), but also provides a navigation function which can be used dynamically by any app or widget using it, which greatly simplifies navigation between different apps.

## Usage


To work correctly, it depends on each app exposing a 
* ```routes``` object, where all publicly accessible routes of an application should be defined. It is used by the ```navigateTo``` method, which we will explain a bit later. At a minimum, a ```rootRoute``` should be defined here.
* ```menuItems``` object, which is used to render the menu entry for your app in the sidebar, or other places. It allows for various customization options, as well as defining subRoutes for the menu entry. An example can be found [here](https://github.com/AKASHAorg/akasha-framework/blob/next/ui/apps/akasha/src/index.tsx).

through its single-spa ```register``` method.

###
The routing data is passed via single-spa plugin props into every app, and is accessible via ```props.plugins['@akashaorg/app-routing']?.routing```.
It provides access to two objects:

* The ```routeObserver```, which is an rxjs [BehaviourSubject](https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject). Subscribing to it will provide an up-to-date routing state for all registered apps, and will update accordingly if an app is installed or uninstalled. It also keeps track of the currently active apps and widgets, without having to deduce any of it from the URL or application state.
* The ```navigateTo``` method, which allows seamless client-side navigation between apps, as well as between routes within an application. It takes two params, and you have to provide *at least one of the two*, regardless which:
  * ```appName``` - the unique name of the app you wish to navigate to, as defined in the app registry. Providing this as the **only** params will navigate you to the provided ```rootRoute```.
  * ```getNavigationUrl``` - a function that allows either for the selection of an exposed sub-route, via the ```subRoutes``` param, or a completely custom routing logic. 
