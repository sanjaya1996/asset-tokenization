var MyToken = artifacts.require('Mytoken.sol');

module.exports = async function (deployer) {
  await deployer.deploy(MyToken, 1000000);
};
