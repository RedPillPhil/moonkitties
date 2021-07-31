var voteContractAddress = "0x1916F482BB9F3523a489791Ae3d6e052b362C777"
var voteContractABI = [{"inputs":[],"name":"cancelVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"eligibilityProof","type":"bytes32[]"},{"internalType":"bool","name":"vote","type":"bool"}],"name":"submitVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"merkleRoot_","type":"bytes32"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"bool","name":"vote","type":"bool"}],"name":"VoteSubmitted","type":"event"},{"inputs":[],"name":"getResult","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"merkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"noVotes","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"voteCancelled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"voteStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"yesVotes","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"}];
var voteHoursOpen = 48;

var EMT =
    (function(addresses){
	var keccak256 = function (address) {
	    return Web3.utils.soliditySha3(address).slice(2);
	}

	addresses = addresses.map(keccak256);

	var merkleTree = new MerkleTree(addresses, keccak256, {sort: true});
	var merkleRoot = merkleTree.getRoot();

	return {keccak256: keccak256,
		merkleTree: merkleTree,
		merkleRootArray: merkleRoot,
		merkleRoot: "0x" + merkleRoot.toString('hex'),
		getProof: function(address){ return merkleTree.getProof(keccak256(address)) },
		getHexProof: function(address){ return merkleTree.getHexProof(keccak256(address)) },
		verifyProof: function(proof, address) {
		    return merkleTree.verify(proof, keccak256(address), merkleRoot);
		}
	       };

    })(EligibleAddresses)

console.log("merkle tree root:", EMT.merkleRoot);


EMT.loadWeb3 = function (cb, eventCB, accountChangeCB){
    if (window.ethereum) {
	var w3 = new Web3(window.ethereum);
	var voteContract = new w3.eth.Contract(voteContractABI, voteContractAddress);

	async function getStatusAsync (address){
	    var yesVotes = await voteContract.methods.yesVotes().call();
	    var noVotes = await voteContract.methods.noVotes().call();
	    var voteCancelled = await voteContract.methods.voteCancelled().call();
	    var voteStartTime = await voteContract.methods.voteStartTime().call();
	    voteStartTime = parseInt(voteStartTime);

	    var hasVoted = null;
	    if(address){
		var hasVoted = await voteContract.methods.hasVoted(address).call();
		var proof = EMT.getHexProof(address);
		var eligible = (proof && (proof.length > 0));
	    }

	    var voteStarted = voteStartTime > 0;

	    var voteEnded = voteStarted && ((Date.now() / 1000) > (voteStartTime + (voteHoursOpen * 60 * 60)));

	    var result = voteEnded ? (yesVotes>noVotes) : null;

	    return {address: address,
		    eligible: eligible,
		    voted: hasVoted,
		    yes: parseInt(yesVotes),
		    no: parseInt(noVotes),
		    cancelled: voteCancelled,
		    started: voteStarted,
		    ended: voteEnded,
		    result: result
		   };
	}

	var getStatus = function (address, cb){
	    getStatusAsync(address).then(cb);
	}

	voteContract.events.VoteSubmitted().on("data", function(data){
	    console.log("Vote", data);
	    if(eventCB){
		if(data.event == "VoteSubmitted"){
		    eventCB(data.transactionHash, data.returnValues.voter, data.returnValues.vote)
		}
	    };
	}).on("connected", function(data){ console.log("connected")})

	var requestAccount = function(cb){
	    ethereum
		.request({method: 'eth_requestAccounts'})
		.then(function (x, y, z){
		    if(x[0]){
			account = x[0];
			getStatus(account, function(status){ cb(null, account, status) })
			//cb(null, account);
		    }else{
			cb("account request rejected");
		    }
		})
		.catch(function(err){
		    cb(err.message)
		})
	};
	if(accountChangeCB){
	    ethereum.on("accountsChanged", function(accounts){
		console.log("account changed")
		if(accounts[0]){
		    account = accounts[0];
		    getStatus(account, function(status){ accountChangeCB(null, account, status) })
		}else{
		    cb("account request rejected");
		}
	    })
	}

	var submitVote = function(address, vote, cb){
	    var vote = (vote && true);
	    var proof = EMT.getHexProof(address);
	    voteContract.methods.submitVote(proof, vote).send({from: address}).then(function(){
		cb(null, address, vote);
	    }).catch(function(e){
		cb(e);
	    })
	}


	ethereum.request({method: 'eth_accounts'})
	    .then(function (accounts) {
		if(Array.isArray(accounts) && accounts[0]){
		    account = accounts[0];
		    getStatus(account, function(status){
			cb(true, {web3: w3,
				  contract: voteContract,
				  account: account,
				  getStatus: getStatus,
				  status: status,
				  submitVote: submitVote,
				  requestAccount: requestAccount});
		    })
		}else{
		    getStatus(null, function(status){
			cb(true, {web3: w3,
				  contract: voteContract,
				  account: false,
				  getStatus: getStatus,
				  status: status,
				  submitVote: submitVote,
				  requestAccount: requestAccount});
		    })
		}
	    })

    }else{
	cb(false, "noprovider");
    }
}

/*


var addr = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
var dpr = EMT.getHexProof(addr);

console.log("merkle proof", dpr)
console.log("tx", JSON.stringify(dpr) + ",1")
console.log("proof is valid?", EMT.verifyProof(dpr, addr));
//console.log("proof component lengths", EMT.getProof(addr).map(x => x.data.length))
*/
