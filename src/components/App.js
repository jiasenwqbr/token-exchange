import "./App.css";
import React, { Component } from "react";
import NavBar from "./NavBar";
import { connect } from "react-redux";
import Content from "./Content";
import Web3 from "web3";
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange,
} from "../store/interactionsWithChain";
import JasonToken from "../abis/JasonToken.json";
import {
  contractsLoadedSelector,
  exchangeLoadedSelector,
  tokenLoadedSelector,
} from "../store/selectors";

class App extends Component {
  componentWillMount() {
    this.loadBlockChainData(this.props.dispatch);
  }
  async loadBlockChainData(dispatch) {
    // const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
    // const networkId = await web3.eth.net.getId();
    // console.log("networkId", networkId);
    // const accounts = await web3.eth.getAccounts();
    // console.log("accounts", accounts);
    // const token = new web3.eth.Contract(
    //   JasonToken.abi,
    //   JasonToken.networks[networkId].address
    // );
    // const totalSupply = await token.methods.totalSupply().call();
    // console.log("token", token);
    // console.log("totalSupply", totalSupply);
    const web3 = loadWeb3(dispatch);
    const account = await loadAccount(web3, dispatch);
    console.log("account", account);
    const networkId = await web3.eth.net.getId();
    const token = await loadToken(web3, networkId, dispatch);
    if (!token) {
      window.alert(
        "Token smart contract not deployed to the current network. Please select another network with Metamask"
      );
    }
    console.log("dispatch", dispatch);
    console.log("token", token);
    const exchange = await loadExchange(web3, networkId, dispatch);
    if (!exchange) {
      window.alert(
        "Exchange smart contract not deployed to the current network. Please select another network with Metamask"
      );
    }
    console.log("exchange", exchange);
  }
  render() {
    return (
      <div className="App">
        <NavBar />
        {this.props.contractsLoaded ? (
          <Content />
        ) : (
          <div className="content"></div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state),
    exchangeLoaded: exchangeLoadedSelector(state),
    tokenLoaded: tokenLoadedSelector(state),
  };
}

export default connect(mapStateToProps)(App);
