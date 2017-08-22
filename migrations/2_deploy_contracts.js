var PandaProject = artifacts.require("./PandaProject.sol");
var PandaToken = artifacts.require("./PandaToken.sol");

module.exports = function(deployer) {
  deployer.deploy(PandaToken);
  deployer.link(PandaToken, PandaProject);
  deployer.deploy(PandaProject);
};
