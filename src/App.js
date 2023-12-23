import React from "react";
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import RandomArray from './RandomArray';
import RandomBalancedBracketSequences from './RandomBalancedBracketSequences';
import RandomLabeledTree from './RandomLabeledTree';
import RandomPrime from './RandomPrime';
import RandomGraph from "./RandomGraph";
import RandomConnectedGraph from './RandomConnectedGraph';
import RandomIncreasing from "./RandomIncreasing";

function App() {
  return (
		<div>
      <Header />
      <RandomArray />
      {/* <RandomIncreasing /> */}
      <RandomBalancedBracketSequences />
      <RandomLabeledTree />
      <RandomGraph />
      <RandomConnectedGraph />
      <RandomPrime />
      <Footer />
		</div>
  );
}

export default App;