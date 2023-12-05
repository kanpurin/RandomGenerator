/* eslint no-undef: 0 */
import React from "react";
import CopyButton from "./CopyButton";

function Result(props) {
  const textTrim = (text, wordCount) => {
    if (text.length > wordCount) {
      return text.substr(0, wordCount) + '...';
    } else {
      return text;
    }
  };

  return (
    <>
      <div className="my-1 position-relative">
        <textarea className="form-control" value={textTrim(props.array.join(props.separate), 1000)} rows={props.rows} readOnly />
        <CopyButton text={props.array.join(props.separate)} />
      </div>
    </>
  );
}

export default Result;