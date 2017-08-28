// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    localhost: {
      host: "localhost", 
      port: 8546,
      network_id: "*" 
    },  
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3"
    },
    testrpc: {
      host: "localhost",
      port: 8545,
      network_id: "99"
    },

  }
};
