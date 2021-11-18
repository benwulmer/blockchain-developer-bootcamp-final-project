App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $('.response').hide();
    await App.bindEvents();
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PayItBackward.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PayItBackwardArtifact = data;
      App.contracts.PayItBackward = TruffleContract(PayItBackwardArtifact);

      // Set the provider for our contract
      App.contracts.PayItBackward.setProvider(App.web3Provider);
    });
    return App.bindEvents();
  },

  sendMoney: function() {
    event.preventDefault();
    var amountWei = document.getElementById("amount").value;
    document.getElementById("amount").value = '';

    var payItForwardInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.PayItBackward.deployed().then(function(instance) {
        payItForwardInstance = instance;

        // Execute adopt as a transaction by sending account
        return payItForwardInstance.send({from: account, amount: amountWei});
      }).then(function(result) {
        // TODO REFRESH DATA return App.refreshData();
      }).catch(function(err) {
        console.log(err.message);
      });
    });


    $('.response').show();
    setTimeout(function () { $('.response').fadeOut('fast'); }, 2000);
  },

  bindEvents: function() {
    $(document).on('click', '.btn-send', App.sendMoney);
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
