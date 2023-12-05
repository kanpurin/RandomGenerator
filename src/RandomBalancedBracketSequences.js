/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result'
import Title from "./Title";
import SetSeed from "./SetSeed";

function RandomBalancedBracketSequences() {
  const [num, setNum] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);
  const [seed, setSeed] = useState(0);
  const [isSetSeed, setIsSetSeed] = useState(false);
  const min_num = 1;
  const max_num = 100000;
  const title = "括弧列";
  const howtotext = "長さ2Nの括弧列を一様ランダムに生成します";

  // 生成
  const doClick = () => {
    if (isSetSeed) {
      Module._setSeed(seed);
    }
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
      <Title title={title} howtotext={howtotext} />

      <div className="form-check">
        <input 
          type="checkbox" 
          className="form-check-input"
          checked={isSetSeed} 
          onChange={() => setIsSetSeed(prevState => !prevState)} 
        />
        <label className="form-check-label">
          Seed値を設定する
        </label>
      </div>
      { isSetSeed && 
        <SetSeed setSeed={setSeed}/>
      }

			<div className="input-group my-3">
				<input type="number" className="form-control col" onChange={doChange} placeholder="N"/>
        {
          illegal ?
            <button type="button" className="btn btn-primary btn" disabled>生成</button>
          :
            <button type="button" className="btn btn-primary btn" onClick={doClick}>生成</button>
        }
			</div>
      <Result array={array} separate="" rows="1"/>
		</div>
	)
}

export default RandomBalancedBracketSequences;