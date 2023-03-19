/* eslint no-undef: 0 */
import React, { useState } from "react";
// import ToolTip from "./ToolTip";
import './Result.css'

function Result(props) {
	const [show, setShow] = useState(false);
  const text = "copy";

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

	return (
    <>
      <div className="input-group mb-3">
        <textarea className="form-control" value={textTrim(props.array.join(props.separate),1000)} rows={props.rows} readOnly/>
        <button 
          type="button" 
          className="btn btn-outline-secondary" 
          id="copybutton"
          onClick={() => doCopy(props.array.join(props.separate))}
          onMouseEnter={() => {setShow(true)}}
          onMouseLeave={() => {setShow(false)}}
        >
          <i className="bi-clipboard-plus"></i>
          { show && <div className='tooltip-top'>{text}</div> }
        </button>
      </div>
    </>
	)
}

export default Result