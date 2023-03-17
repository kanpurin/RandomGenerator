/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import HowTo from "./HowTo";
import Loading from "./Loading";
import Result from "./Result";
import { int2str, str2int1, str2int2, isLtLL, isGtLL } from './int64'

function RandomPrime() {
  const [isLoading, setIsLoading] = useState(false);
  const [lower1, setLower1] = useState(0);
  const [lower2, setLower2] = useState(0);
  const [upper1, setUpper1] = useState(0);
  const [upper2, setUpper2] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);

  const min_lower1 = 0, min_lower2 = 2;
  const max_lower1 = 1000000000, max_lower2 = 0;
  const min_upper1 = 0, min_upper2 = 2;
  const max_upper1 = 1000000000, max_upper2 = 0;
  const howtotext = "(下限)以上(上限)以下の素数を一様ランダムに生成します"

  const doClick = () => {
    setIsLoading(true);
    const nByte = 4;
    const length = 2;
    const buffer = Module._malloc(length * nByte);

    Module._randomPrimeLL(buffer, lower1, lower2, upper1, upper2);

    let ret = []
    ret.push(int2str(Module.getValue(buffer, 'i32'),
                     Module.getValue(buffer + nByte, 'i32')));
    setArray(ret);

    Module._free(buffer);
    setIsLoading(false);
  }

  // チェック
  useEffect(() => {
    if (isLtLL(lower1,lower2,min_lower1,min_lower2) ||
        isLtLL(max_lower1,max_lower2,lower1,lower2)) {
      setIllegal(true);
    }
    else if (isLtLL(upper1,upper2,min_upper1,min_upper2) ||
             isLtLL(max_upper1,max_upper2,upper1,upper2)) {
      setIllegal(true);
    }
    else if (isGtLL(lower1, lower2, upper1, upper2)) {
      setIllegal(true);
    }
    else {
      setIllegal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lower1, lower2, upper1, upper2]);

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
      <h2 className='d-inline'>素数</h2>
      <HowTo content={howtotext} />
      { isLoading && <Loading /> }

			<div className="input-group m-3">
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

export default RandomPrime