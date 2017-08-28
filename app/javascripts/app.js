// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";


// Import libraries we need.
import Chartist from 'chartist';
import config   from './config.js';

import async from 'async';


import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import panda_project_artifacts from '../../build/contracts/PandaProject.json'
import panda_token_artifacts from '../../build/contracts/PandaToken.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var PandaProject = contract(panda_project_artifacts);
var PandaToken = contract(panda_token_artifacts);




// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    PandaProject.setProvider(web3.currentProvider);
    PandaToken.setProvider(web3.currentProvider);
    
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        document.querySelector('.ready-now').style.display = 'none';
        document.querySelector('.no-accounts').style.display = 'block';
        //alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
      self.getDistribution();

    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  weiToEth: function(wei) {
    return wei / 1000000000000000000;
  },

  humanReadablePandaTokenValue: function(pan) {
    return pan / 100000000000000000;
  },

  refreshBalance: function() {
    var self = this;
    var meta;

    web3.eth.getBalance( account , function( err, weiBal ) {
      var balance = Math.round( self.weiToEth( weiBal ) * 100 ) / 100;
      document.querySelector('.balance').innerHTML = balance;
      if (balance>0) { 
        document.querySelector('.donate-button').style.display = 'block';
      } else {
        document.querySelector('.donate-button').style.display = 'hide';
      }
    });

    PandaToken.at(config.contract_locations.panda_token).then(function(pandaTokenContract) {
      return pandaTokenContract.balanceOf.call( account );
    }).then(function(pandaTokenBal) {

      if (pandaTokenBal>0) {
        self.setStatus(" You have "+self.humanReadablePandaTokenValue(pandaTokenBal)+" Panda Tokens ");
      }

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error fetching panda token bal; see log.");
    });

  },


  donate: function(weiVal) {
    var self = this;
    PandaProject.at(config.contract_locations.panda_project).then(function(pandaProjectContract) {
      return pandaProjectContract.donate.sendTransaction( { value: weiVal, from: account, to: config.contract_locations.panda_project, gas: 100000 } );
    }).then(function(r) {

      self.setStatus("Your transaction should be processed in a few minutes, wait a moment then refresh the page to see your Panda Token balance");

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error donating; see log.");
    });
  },

  getDistribution: function() {
    var self = this;
    PandaProject.at(config.contract_locations.panda_project)
    .then(function(pandaProjectContract) {

      var distributionList = [];

      var distribution = [];
      var index = 0;
      distribution.push('initial pass');
      async.until(  
        function () { 
          return distribution[0]=="0x"; 
        },
        function(callback) { 
          pandaProjectContract.distributions.call(index).then( function(dist) {
            //console.log("GOT DISTRUBUTION : ", index, dist);
            index++;
            distribution = dist;

            if ( distribution[0]!="0x" ) {
              distributionList.push(distribution);
            }

            callback(null);
          } ).catch( (e)=>callback(e) ); 
        },
        function(e) { 
          if (e) { console.log(e); self.setStatus("Err getting dist; see log."); } 
          //console.log(distributionList);
          self.explainDistribution(distributionList);
          
        }
      )
    
    });

  },

  explainDistribution: function(distributionList) {

    var contractExplanation = "<strong>Donation distribution fine-print</strong>";
    contractExplanation += "<ul>";
    for (let d of distributionList) {
      contractExplanation += "<li>" +
                             d[1] + "%" + " to " +
                             config.recepient_descriptions[d[0].toLowerCase()] + "<br>" +
                             "<a class=\"eth_link\" href=\"https://ropsten.etherscan.io/address/"+d[0]+"#internaltx\" target=\"_blank\">"+d[0]+"</a>"+
                             "</li>"; 
    }
    contractExplanation += "<ul>";
    document.getElementById('contract-explanation').innerHTML = contractExplanation;

    console.log(config.recepient_descriptions);
    
  },

  drawChart: function() {
    
    // NB : This bit is not done yet - below is a sample chartist chart

    // Drawing a donut chart
    new Chartist.Pie('#dist-chart', {
      series: [{
        value: 20,
        name: 'Series 1',
        className: 'my-custom-class-one',
        meta: 'Meta One'
      }, {
        value: 10,
        name: 'Series 2',
        className: 'my-custom-class-two',
        meta: 'Meta Two'
      }, {
        value: 70,
        name: 'Series 3',
        className: 'my-custom-class-three',
        meta: 'Meta Three'
      }]
    });
  
  }

};



window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {

    document.querySelector('.ready-now').style.display = 'block';
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    document.querySelector('.no-metamask').style.display = 'block';

    //console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});

