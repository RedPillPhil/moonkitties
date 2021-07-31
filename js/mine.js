function createMiner(searchSeed){
    if(searchSeed.slice(0,2) == "0x"){
	searchSeed = searchSeed.slice(2);
    }
    var workers = [];
    function terminateWorkers(){
	workers.map(function(w){
	    w.terminate();
	})
	workers = [];
    }
    return function mine(workerCount, handleResult){
	workerCount = workerCount || 1;
	terminateWorkers();
	workers = [];
	for (var i = 0; i < workerCount; i++){
	    var w = new Worker('/js/mine-worker.js');
	    w.onmessage = function(e) {
		terminateWorkers();
		var result = JSON.parse(e.data);
		handleResult(result);
	    }
	    workers.push(w);
	    w.postMessage(searchSeed);
	}
    }
}
