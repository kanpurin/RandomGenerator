/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result'
import HowTo from "./HowTo";
import Loading from "./Loading";

function RandomBalancedBracketSequences() {
  const [num, setNum] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const min_num = 1;
  const max_num = 100000;

  const howtotext = "長さ2Nの括弧列を一様ランダムに生成します"

  // 生成
  const doClick = () => {
    setIsLoading(true);
    const nByte = 4;
    const length = num;
    const buffer = Module._malloc(length * 2 * nByte);

    Module._randomBalancedBracketSequences(buffer, length);

    let ret = [""]
    for (let i = 0; i < length * 2; i++) {
      let p = Module.getValue(buffer + i*nByte, 'i32');
      if (p === 0) {
        ret[0] += '(';
      }
      else {
        ret[0] += ')';
      }
    }
    setArray(ret);

    Module._free(buffer);
    setIsLoading(false);
  }

  // チェック
  useEffect(() => {
    if (num < min_num || max_num < num) {
      setIllegal(true);
    }
    else {
      setIllegal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num]);

  const doChange = (event) => {
    setNum(Number(event.target.value));
  }

	return (
		<div className='container'>
      <h2 className='d-inline'>括弧列</h2>
      <HowTo content={howtotext} />
      { isLoading && <Loading /> }

			<div className="input-group m-3">
				<input type="number" className="form-control col" onChange={doChange} placeholder="N"/>
        {
          illegal ?
            <input type="submit" value="生成" className="btn btn-primary btn col-1" disabled/>
          :
				    <input type="submit" value="生成" className="btn btn-primary btn col-1" onClick={doClick}/>
        }
			</div>
      <Result array={array} separate="" rows="1"/>
		</div>
	)
}

export default RandomBalancedBracketSequences