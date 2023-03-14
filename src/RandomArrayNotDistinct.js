/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result';

function RandomArrayNotDistinct({setIsLoading}) {
  const [num, setNum] = useState(0);
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);

  const min_num = 0;
  const max_num = 200000;
  const min_lower = -1000000000;
  const max_lower = 1000000000;
  const min_upper = -1000000000;
  const max_upper = 1000000000;

  // チェック
  useEffect(() => {
    if (num < min_num || max_num < num) {
      setIllegal(true);
    }
    else if (lower < min_lower || max_lower < lower) {
      setIllegal(true);
    }
    else if (upper < min_upper || max_upper < upper) {
      setIllegal(true);
    }
    else if (lower > upper) {
      setIllegal(true);
    }
    else {
      setIllegal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num, lower, upper]);

	// 生成
  const doClick = () => {
    setIsLoading(true);
    const nByte = 4;
    const length = num;
    const buffer = Module._malloc(length * nByte);

    Module._randomArray(buffer, length, lower, upper);

    let ret = []
    for (let i = 0; i < length; i++) {
      ret.push(Module.getValue(buffer + i*nByte, 'i32'));
    }
    setArray(ret);
    Module._free(buffer);
    setIsLoading(false);
  }
  
  const doChange = (event) => {
    setNum(event.target.value)
  }
  const doChangeLower = (event) => {
    setLower(event.target.value)
  }
  const doChangeUpper = (event) => {
    setUpper(event.target.value)
  }

  // const doMouseOver = () => {
  //   setMessage("ランダム生成しません");
  // }

	return (
		<div>
			<div className="input-group m-3">
				<input type="number" className="form-control col" onChange={doChange} placeholder="N"/>
				<input type="number" className="form-control col" onChange={doChangeLower} placeholder="下限"/>
				<input type="number" className="form-control col" onChange={doChangeUpper} placeholder="上限"/>
        {
          illegal ?
            <input type="submit" value="生成" className="btn btn-primary btn col-1" disabled/>
          :
				    <input type="submit" value="生成" className="btn btn-primary btn col-1" onClick={doClick}  />
        }
			</div>
      <Result array={array} separate=" " rows="1"/>
		</div>
	)
}

export default RandomArrayNotDistinct