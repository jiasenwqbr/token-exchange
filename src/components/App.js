import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import Navbar from "./NavBar";
import Content from "./Content";
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange,
} from "../store/interactionsWithChain";
import { metaMaskFound } from "../store/actions";
import {
  contractsLoadedSelector,
  metaMaskFoundSelector,
} from "../store/selectors";
import MetaMaskWarning from "./MetaMaskWarning";

const showError = (props) => {
  if (!props.metaMaskFound) {
    return <MetaMaskWarning />;
  }

  return (
    <div className="content text-white">
      <h1>Please log in to MetaMask and refresh the page.</h1>
    </div>
  );
};

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch);

    if (typeof window.web3 === "undefined") {
      alert("MetaMask not found");
      dispatch(metaMaskFound(false));
      return;
    }

    dispatch(metaMaskFound(true));

    await window.ethereum.enable();

    // let network = await web3.eth.net.getNetworkType();
    const networkId = await web3.eth.net.getId();

    await loadAccount(web3, dispatch);

    const token = await loadToken(web3, networkId, dispatch);

    if (!token) {
      window.alert(
        "Token smart contract not deployed to the current network. Please select another network with Metamask"
      );
    }
    const exchange = await loadExchange(web3, networkId, dispatch);
    if (!exchange) {
      window.alert(
        "Exchange smart contract not deployed to the current network. Please select another network with Metamask"
      );
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        {this.props.contractsLoaded ? <Content /> : showError(this.props)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state),
    metaMaskFound: metaMaskFoundSelector(state),
  };
}

export default connect(mapStateToProps)(App);
