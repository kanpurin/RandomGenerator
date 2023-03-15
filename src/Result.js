/* eslint no-undef: 0 */
import React from "react";
import ToolTip from "./ToolTip";

function Result(props) {
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
    <div className="input-group m-3">
      <textarea className="form-control" value={textTrim(props.array.join(props.separate),1000)} rows={props.rows} readOnly/>
      {/* <ToolTip content={text} position='top'>
        <button type="button" className="btn btn-outline-secondary" onClick={() => doCopy(props.array.join(props.separate))}>
          <i className="bi-clipboard-plus"></i>
        </button>
      </ToolTip> */}
      <button type="button" className="btn btn-outline-secondary" onClick={() => doCopy(props.array.join(props.separate))}>
        <i className="bi-clipboard-plus"></i>
      </button>
    </div>
	)
}

export default Result