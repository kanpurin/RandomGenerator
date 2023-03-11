import React, { useState } from "react";
import { Module } from './random'

function Form() {
  const [num, setNum] = useState(0);
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(0);
  const [array, setArray] = useState([]);
  const [message, setMessage] = useState("ランダム生成");
	// var Module=typeof Module!="undefined"?Module:{};

	// 生成
  const doClick = () => {
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

  const textTrim = (text, wordCount) => {
    if (text.length > wordCount) {
      return text.substr(0,wordCount) + '...';
    }
    else {
      return text;
    }
  }

  const doCopy = (text) => {
    navigator.clipboard.writeText(text);
	}

  const doMouseOver = () => {
    setMessage("ランダム生成しません");
  }

  const doMouseOut = () => {
    setMessage("ランダム生成");
  }

	return (
		<div className='container'>
			<h4 className='my-3' onMouseOver={doMouseOver} onMouseOut={doMouseOut}>{message}</h4>
			<div className="form-group row">
				<input type="number" className="form-control col" onChange={doChange} min="0" max="200000" placeholder="N"/>
				<input type="number" className="form-control col" onChange={doChangeLower} min="-1000000000" max="1000000000" placeholder="下限"/>
				<input type="number" className="form-control col" onChange={doChangeUpper} min="-1000000000" max="1000000000" placeholder="上限"/>
				<input type="submit" value="生成" className="btn btn-primary btn col-2" onClick={doClick}  />
			</div>
			<div className="form-group row">
				<input type="text" className="form-control col" value={textTrim(array.join(' '),1000)} readOnly />
				<input type="button" value="copy" className="btn btn-primary btn col-2" onClick={doCopy(array.join(' '))}  />
			</div>
		</div>
	)
}

export default Form