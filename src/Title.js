/* eslint no-undef: 0 */
import React from "react";
import HowTo from "./HowTo";

function Title({title, howtotext}) {
	return (
    <>
      <h2 className='d-inline'>{title}</h2>
      <HowTo content={howtotext} />
    </>
	)
}

export default Title;