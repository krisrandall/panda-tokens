// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

import Chartist from 'chartist';
import config   from './config.js';


// Import libraries we need.
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

  refreshBalance: function() {
    var self = this;
    var meta;
    PandaToken.at(config.contract_locations.panda_token).then(function(instance) {
      meta = instance;
      return meta.balance.call({from: account});
    }).then(function(balance) {

      document.querySelector('.balance').innerHTML = balance;
      if (balance<1) { 
        document.querySelector('.give-tokens').style.display = 'block';
        document.querySelector('.donate-button').style.display = 'none';
      } else {
        document.querySelector('.donate-button').style.display = 'block';
        document.querySelector('.give-tokens').style.display = 'none';
      }

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  getFreeTokens: function(howMany) {

    alert('this doesnt currenly work, sorry :(');

    var self = this;
    var meta;
    PandaToken.at(config.contract_locations.panda_token).then(function(instance) {
      meta = instance;
      return meta.tokenFaucet.call(howMany, {from: account});
    }).then(function(balance) {
alert(balance);
      self.refreshBalance();

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting tokens; see log.");
    });
  },

  donateTokens: function(amt) {
    var self = this;
    var meta;
    PandaProject.at(config.contract_locations.panda_project).then(function(instance) {
      meta = instance;
      return meta.donate.call(amt, {from: account});
    }).then(function(balance) {
      alert('the donate has happened!!');
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error donating tokens; see log.");
    });
  },

  donateETH: function() {

  },

  getDistribution: function() {
    var self = this;
    var meta;
    PandaProject.at(config.contract_locations.panda_project).then(function(instance) {
      meta = instance;
      return meta.distributions.call();
    }).then(function(dist) {
console.log(dist);
alert(dist);
      self.drawChart();

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting distributions; see log.");
    });
  },

  drawChart: function() {
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

