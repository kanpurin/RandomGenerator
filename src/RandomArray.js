/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Title from "./Title";
import Result from "./Result";
import SetSeed from "./SetSeed";
import { int2str, str2int1, str2int2, isLtLL, isGtLL } from './int64'

function RandomArray() {
  const [isDistinct, setIsDistinct] = useState(false);
  const [num, setNum] = useState(0);
  const [lower1, setLower1] = useState(0);
  const [lower2, setLower2] = useState(0);
  const [upper1, setUpper1] = useState(0);
  const [upper2, setUpper2] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [seed, setSeed] = useState(0);
  const [isSetSeed, setIsSetSeed] = useState(false);
  const [array, setArray] = useState([]);

  const min_num = 1, max_num = 500000;
  const min_lower1 = -1000000000, min_lower2 = 0;
  const max_lower1 = 1000000000, max_lower2 = 0;
  const min_upper1 = -1000000000, min_upper2 = 0;
  const max_upper1 = 1000000000, max_upper2 = 0;
  const title="数列";
  const howtotext = "(下限)以上(上限)以下の整数を一様ランダムにN個生成します";

  const doClick = () => {
    if (isSetSeed) {
      Module._setSeed(seed);
    }
    
    const nByte = 4;
    const length = num*2;
    const buffer = Module._malloc(length * nByte);

    if (isDistinct) {
      Module._randomPermutationLL(buffer, num, lower1, lower2, upper1, upper2);
    }
    else {
      Module._randomArrayLL(buffer, num, lower1, lower2, upper1, upper2);
    }

    let ret = []
    for (let i = 0; i < num; i++) {
      ret.push(int2str(Module.getValue(buffer + i*2*nByte, 'i32'),
                       Module.getValue(buffer + (i*2+1)*nByte, 'i32')));
    }
    setArray(ret);

    Module._free(buffer);
  }

  // チェック
  useEffect(() => {
    if (num < min_num || max_num < num) {
      setIllegal(true);
    }
    else if (isLtLL(lower1,lower2,min_lower1,min_lower2) ||
             isLtLL(max_lower1,max_lower2,lower1,lower2)) {
      setIllegal(true);
    }
    else if (isLtLL(upper1,upper2,min_upper1,min_upper2) ||
             isLtLL(max_upper1,max_upper2,upper1,upper2)) {
      setIllegal(true);
    }
    else if (isDistinct && (upper1 === lower1) && upper2 - lower2 + 1 < num) {
      setIllegal(true);
    }
    else if (!isDistinct && isGtLL(lower1, lower2, upper1, upper2)) {
      setIllegal(true);
    }
    else {
      setIllegal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num, lower1, lower2, upper1, upper2, isDistinct]);

  const doChange = (event) => {
    setNum(Number(event.target.value));
  }
  const doKeyUpLower = (event) => {
    const lower1 = str2int1(event.target.value);
    const lower2 = str2int2(event.target.value);
    setLower1(lower1);
    setLower2(lower2);
  }
  const doKeyUpUpper = (event) => {
    const upper1 = str2int1(event.target.value);
    const upper2 = str2int2(event.target.value);
    setUpper1(upper1);
    setUpper2(upper2);
  }

	return (
		<div className='container'>
      <Title title={title} howtotext={howtotext} />

      <div className="form-check">
        <input 
          type="checkbox" 
          className="form-check-input"
          checked={isDistinct} 
          onChange={() => setIsDistinct(prevState => !prevState)} 
        />
        <label className="form-check-label">
          重複なし
        </label>
      </div>
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
				<input type="number" className="form-control col" onKeyUp={doKeyUpLower} placeholder="下限"/>
				<input type="number" className="form-control col" onKeyUp={doKeyUpUpper} placeholder="上限"/>
        {
          illegal ?
            <button type="button" className="btn btn-primary btn" disabled>生成</button>
          :
            <button type="button" className="btn btn-primary btn" onClick={doClick}>生成</button>
        }
			</div>
      <Result array={array} separate=" " rows="1"/>
		</div>
	)
}

export default RandomArray