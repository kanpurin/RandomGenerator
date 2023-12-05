/* eslint no-undef: 0 */
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaQuestionCircle } from 'react-icons/fa';

function HowTo({tooltipText}) {  
  const renderTooltip = (props) => (
    <Tooltip id="icon-tooltip" {...props} placement="right">
      {tooltipText}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <span>
        <FaQuestionCircle style={{ fontSize: '18px', color: '#333' }} />
      </span>
    </OverlayTrigger>
  );
}

export default HowTo;