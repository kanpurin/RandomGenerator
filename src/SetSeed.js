/* eslint no-undef: 0 */
import React from "react";

function SetSeed({setSeed}) {
	return (
    <input 
      type="number" 
      className="form-control"
      onChange={(e) => setSeed(Number(e.target.value))} 
      placeholder="seed"
    />
	)
}

export default SetSeed