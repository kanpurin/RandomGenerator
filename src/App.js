import React, { FC, useEffect } from "react";
import './App.css'
import RandomArray from './RandomArray'
import RandomBalancedBracketSequences from './RandomBalancedBracketSequences'
import RandomLabeledTree from './RandomLabeledTree'

function App() {
  return (
		<div>
			<h1 className='bg-primary text-white display-4'>Random Generator</h1>
      <RandomArray />
      <RandomBalancedBracketSequences />
      <RandomLabeledTree />
		</div>
  );
}

export default App;