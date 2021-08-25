const path = require('path');
const worker = require('worker_threads');
 
require('ts-node').register();
require(path.resolve(__dirname, worker.workerData.path));
