/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result';
import Title from "./Title";

function RandomLabeledTree() {
  const [num, setNum] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const min_num = 1;
  const max_num = 200000;

  const title = "ラベル付き木"
  const howtotext = "頂点数Nのラベル付き木を一様ランダムに生成します"

  // 生成
  const doClick = () => {
    const nByte = 4;
    const length = num;
    const buffer = Module._malloc(length *2* nByte);

    Module._randomLabeledTree(buffer, length);

    let ret = []
    if (isChecked) {
      ret.push(length + ' ' + (length-1) + '\n');
    }
    for (let i = 0; i < length-1; i++) {
      let u = Module.getValue(buffer + (2*i)*nByte, 'i32');
      let v = Module.getValue(buffer + (2*i+1)*nByte, 'i32');
      if (i < length-2) {
        ret.push(u + ' ' + v + '\n');
      }
      else {
        ret.push(u + ' ' + v);
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
    
      <div className="form-check mb-3">
        <input 
          type="checkbox" 
          className="form-check-input"
          checked={isChecked} 
          onChange={() => setIsChecked(prevState => !prevState)} 
        />
        <label className="form-check-label">
          "N N-1"を先頭に付ける
        </label>
      </div>

			<div className="input-group mb-3">
				<input type="number" className="form-control col" onChange={doChange} placeholder="N"/>
        {
          illegal ?
            <button type="button" className="btn btn-primary btn" disabled>生成</button>
          :
            <button type="button" className="btn btn-primary btn" onClick={doClick}>生成</button>
        }
			</div>
      <Result array={array} separate="" rows="3"/>
		</div>
	)
}

export default RandomLabeledTree