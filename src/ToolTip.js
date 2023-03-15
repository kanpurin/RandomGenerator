/* eslint no-undef: 0 */
import React, { useState } from "react";
import './ToolTip.css'

function ToolTip({children, content, position}) {
	const [show, setShow] = useState(false);
  const posOption = ['right', 'left', 'top'];

  let cName = 'tooltip-right';
  if (posOption.includes(position)) {
    cName = 'tooltip-' + position;
  }
  
  return (
    <div className="tooltip-container">
      <div 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
			>
				{children}</div>
      { show && <div className={cName}>{content}</div> }
    </div>
  );
}

export default ToolTip