/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result'
import HowTo from "./HowTo";
import Loading from "./Loading";

function RandomGraph() {
  const [numVertex, setNumVertex] = useState(0);
  const [numEdge, setNumEdge] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const min_num_vertex = 1;
  const max_num_vertex = 200000;
  const min_num_edge = 0;
  const max_num_edge = 200000;

  const title = "単純グラフ"
  const howtotext = "頂点数N辺数Mの単純グラフを一様ランダムに生成します"

  // 生成
  const doClick = () => {
    setIsLoading(true);
    const nByte = 4;
    const length = numEdge * 2;
    const buffer = Module._malloc(length * nByte);

    Module._randomGraph(buffer, numVertex, numEdge);

    let ret = []
    if (isChecked) {
      ret.push(numVertex + ' ' + numEdge + '\n');
    }
    for (let i = 0; i < numEdge; i++) {
      let u = Module.getValue(buffer + (2*i)*nByte, 'i32');
      let v = Module.getValue(buffer + (2*i+1)*nByte, 'i32');
      if (i < numEdge - 1) {
        ret.push(u + ' ' + v + '\n');
      }
      else {
        ret.push(u + ' ' + v);
      }
    }
    setArray(ret);
    Module._free(buffer);
    setIsLoading(false);
  }

  // チェック
  useEffect(() => {
    if (numVertex < min_num_vertex || max_num_vertex < numVertex) {
      setIllegal(true);
    }
    else if (numEdge < min_num_edge || max_num_edge < numEdge) {
      setIllegal(true);
    }
    else if (2*numEdge > numVertex*(numVertex-1)) {
      setIllegal(true);
    }
    else {
      setIllegal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numVertex, numEdge]);

  const doChangeNumVertex = (event) => {
    setNumVertex(Number(event.target.value));
  }

  const doChangeNumEdge = (event) => {
    setNumEdge(Number(event.target.value));
  }

	return (
		<div className='container'>
      <h2 className='d-inline'>{title}</h2>
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
          "N M"を先頭に付ける
        </label>
      </div>

			<div className="input-group m-3">
				<input type="number" className="form-control col" onChange={doChangeNumVertex} placeholder="N"/>
				<input type="number" className="form-control col" onChange={doChangeNumEdge} placeholder="M"/>
        {
          illegal ?
            <input type="submit" value="生成" className="btn btn-primary btn col-1" disabled/>
          :
				    <input type="submit" value="生成" className="btn btn-primary btn col-1" onClick={doClick}/>
        }
			</div>
      <Result array={array} separate="" rows="3"/>
		</div>
	)
}

export default RandomGraph