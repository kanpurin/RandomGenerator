/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import HowTo from "./HowTo";
import Loading from "./Loading";
import Result from "./Result";

function int2str(n1, n2) {
  if (n1 > 0) {
    return String(n1) + ('000000000'+n2).slice(-9);
  }
  else if (n1 < 0) {
    n1 = -n1;
    n2 = -n2;
    return '-' + String(n1) + ('000000000'+n2).slice(-9);
  }
  else {
    return String(n2);
  }
}

function str2int1(str) {
  if (str.length === 0) return 0;
  if (str.length <= 10 && str[0] === '-') {
    return 0;
  }
  else if (str.length <= 9 && str[0] !== '-') {
    return 0;
  }
  else {
    return Number(str.slice(0,-9));
  }
}

function str2int2(str) {
  if (str.length === 0) return 0;
  if (str.length <= 10 && str[0] === '-') {
    return Number(str);
  }
  else if (str.length <= 9 && str[0] !== '-') {
    return Number(str);
  }
  else if (str[0] === '-') {
    return -Number(str.slice(-9));
  }
  else {
    return Number(str.slice(-9));
  }
}

// n < m
function isLtLL(n1, n2, m1, m2) {
  if (n1 < m1) return true;
  if (n1 > m1) return false;
  if (n2 < m2) return true;
  else return false;
}

// n > m
function isGtLL(n1, n2, m1, m2) {
  if (n1 > m1) return true;
  if (n1 < m1) return false;
  if (n2 > m2) return true;
  else return false;
}

function RandomArray() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDistinct, setIsDistinct] = useState(false);
  const [num, setNum] = useState(0);
  const [lower1, setLower1] = useState(0);
  const [lower2, setLower2] = useState(0);
  const [upper1, setUpper1] = useState(0);
  const [upper2, setUpper2] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);

  const min_num = 0, max_num = 500000;
  const min_lower1 = -1000000000, min_lower2 = 0;
  const max_lower1 = 1000000000, max_lower2 = 0;
  const min_upper1 = -1000000000, min_upper2 = 0;
  const max_upper1 = 1000000000, max_upper2 = 0;
  const howtotext = "(下限)以上(上限)以下の整数を一様ランダムにN個生成します"

  const doClick = () => {
    setIsLoading(true);
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
    setIsLoading(false);
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
      <h2 className='d-inline'>数列</h2>
      <HowTo content={howtotext} />
      { isLoading && <Loading /> }

      <div className="form-check m-3">
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
			<div className="input-group m-3">
				<input type="number" className="form-control col" onChange={doChange} placeholder="N"/>
				<input type="number" className="form-control col" onKeyUp={doKeyUpLower} placeholder="下限"/>
				<input type="number" className="form-control col" onKeyUp={doKeyUpUpper} placeholder="上限"/>
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

export default RandomArray