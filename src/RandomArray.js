/* eslint no-undef: 0 */
import React, { useState } from "react";
import RandomArrayNotDistinct from "./RandomArrayNotDistinct";
import RandomArrayDistinct from "./RandomArrayDistinct";
import HowTo from "./HowTo";
import Loading from "./Loading";

function RandomArray() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const howtotext = "(下限)以上(上限)以下の整数を一様ランダムにN個生成します"

	return (
		<div className='container'>
      <h2 className='d-inline'>数列</h2>
      <HowTo content={howtotext} />
      { isLoading && <Loading /> }

      <div className="form-check m-3">
        <input 
          type="checkbox" 
          className="form-check-input"
          checked={isChecked} 
          onChange={() => setIsChecked(prevState => !prevState)} 
        />
        <label className="form-check-label">
          重複なし
        </label>
      </div>
      {
        isChecked ?
          <RandomArrayDistinct setIsLoading={setIsLoading}/>
        :
          <RandomArrayNotDistinct setIsLoading={setIsLoading}/>
      }
		</div>
	)
}

export default RandomArray