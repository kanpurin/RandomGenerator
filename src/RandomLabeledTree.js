/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result';
import Title from "./Title";
import SetSeed from "./SetSeed";
import DrawUndirectedGraph from "./DrawUndirectedGraph";

function RandomLabeledTree() {
  const [num, setNum] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);
  const [isPrePrint, setIsPrePrint] = useState(false);
  const [seed, setSeed] = useState(0);
  const [isSetSeed, setIsSetSeed] = useState(false);
  const [isDrawGraph, setIsDrawGraph] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const min_num = 1;
  const max_num = 200000;

  const title = "ラベル付き木"
  const howtotext = "頂点数Nのラベル付き木を一様ランダムに生成します"

  // 生成
  const doClick = () => {
    if (isSetSeed) {
      Module._setSeed(seed);
    }
    const nByte = 4;
    const length = num;
    const buffer = Module._malloc(length *2* nByte);

    Module._randomLabeledTree(buffer, length);

    let ret = []
    let _nodes = []
    let _edges = []
    for (let i = 1; i <= num; i++) {
      _nodes.push(i);
    }
    if (isPrePrint) {
      ret.push(length + ' ' + (length-1) + '\n');
    }
    for (let i = 0; i < length-1; i++) {
      let u = Module.getValue(buffer + (2*i)*nByte, 'i32');
      let v = Module.getValue(buffer + (2*i+1)*nByte, 'i32');
      _edges.push([u,v]);
      if (i < length-2) {
        ret.push(u + ' ' + v + '\n');
      }
      else {
        ret.push(u + ' ' + v);
      }
    }
    setArray(ret);
    setNodes(_nodes);
    setEdges(_edges);
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
          checked={isPrePrint} 
          onChange={() => setIsPrePrint(prevState => !prevState)} 
        />
        <label className="form-check-label">
          "N N-1"を先頭に付ける
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
      <div className="form-check">
        <input 
          type="checkbox" 
          className="form-check-input"
          checked={isDrawGraph} 
          onChange={() => setIsDrawGraph(prevState => !prevState)} 
        />
        <label className="form-check-label">
          グラフを描画する
        </label>
      </div>

			<div className="input-group my-3">
				<input type="number" className="form-control col" onChange={doChange} placeholder="N"/>
        {
          illegal ?
            <button type="button" className="btn btn-primary btn" disabled>生成</button>
          :
            <button type="button" className="btn btn-primary btn" onClick={doClick}>生成</button>
        }
			</div>
      <Result array={array} separate="" rows="3"/>
      { isDrawGraph && <DrawUndirectedGraph nodes={nodes} edges={edges} /> }
		</div>
	)
}

export default RandomLabeledTree