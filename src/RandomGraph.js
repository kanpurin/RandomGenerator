/* eslint no-undef: 0 */
import React, { useState, useEffect } from "react";
import Result from './Result'
import Title from "./Title";
import SetSeed from "./SetSeed";
import DrawUndirectedGraph from "./DrawUndirectedGraph";

function RandomGraph() {
  const [numVertex, setNumVertex] = useState(0);
  const [numEdge, setNumEdge] = useState(0);
  const [illegal, setIllegal] = useState(false);
  const [array, setArray] = useState([]);
  const [isPrePrint, setIsPrePrint] = useState(false);
  const [seed, setSeed] = useState(0);
  const [isSetSeed, setIsSetSeed] = useState(false);
  const [isDrawGraph, setIsDrawGraph] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const min_num_vertex = 1;
  const max_num_vertex = 200000;
  const min_num_edge = 0;
  const max_num_edge = 200000;

  const title = "単純グラフ"
  const howtotext = "頂点数N辺数Mの単純グラフを一様ランダムに生成します"

  // 生成
  const doClick = () => {
    if (isSetSeed) {
      Module._setSeed(seed);
    }

    const nByte = 4;
    const length = numEdge * 2;
    const buffer = Module._malloc(length * nByte);

    Module._randomGraph(buffer, numVertex, numEdge);
    
    let ret = []
    let _nodes = []
    let _edges = []
    for (let i = 1; i <= numVertex; i++) {
      _nodes.push(i);
    }
    if (isPrePrint) {
      ret.push(numVertex + ' ' + numEdge + '\n');
    }
    for (let i = 0; i < numEdge; i++) {
      let u = Module.getValue(buffer + (2*i)*nByte, 'i32');
      let v = Module.getValue(buffer + (2*i+1)*nByte, 'i32');
      _edges.push([u,v]);
      if (i < numEdge - 1) {
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
      <Title title={title} howtotext={howtotext} />
    
      <div className="form-check">
        <input 
          type="checkbox" 
          className="form-check-input"
          checked={isPrePrint} 
          onChange={() => setIsPrePrint(prevState => !prevState)} 
        />
        <label className="form-check-label">
          "N M"を先頭に付ける
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
				<input type="number" className="form-control col" onChange={doChangeNumVertex} placeholder="N"/>
				<input type="number" className="form-control col" onChange={doChangeNumEdge} placeholder="M"/>
        {
          illegal ?
            <button type="button" className="btn btn-primary btn" disabled>生成</button>
          :
            <button type="button" className="btn btn-primary btn" onClick={doClick}>生成</button>
        }
			</div>
      <Result array={array} separate="" rows="3"/>
      { isDrawGraph && <DrawUndirectedGraph nodes={nodes} edges={edges} />}
		</div>
	)
}

export default RandomGraph