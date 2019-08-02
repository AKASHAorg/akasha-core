import AppLoader from "awf-plugin-loader";
import Plugin from "{{name}}";
import * as serviceWorker from "./serviceWorker";

/**
 * @Note You shouldn't make any change to this file.
 * It contains the required logic to run your plugin.
 * Any changes must be requested in the /templates/ first!
 */

/**
 *  Think of this 'example' folder as a 'final'
 *  application with only one plugin, which is "{{name}}"
 */

const app = new AppLoader({});

app.registerPlugin(Plugin);

app.start();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
