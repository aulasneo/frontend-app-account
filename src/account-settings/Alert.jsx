import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Alert = (props) => (
  <div className={classNames('alert d-flex align-items-start alert-warning-passw', props.className)}>
    <div className="mt-n1" >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1571_3759)">
          <path d="M12 0.75C5.78662 0.75 0.75 5.78662 0.75 12C0.75 18.2134 5.78662 23.25 12 23.25C18.2134 23.25 23.25 18.2134 23.25 12C23.2429 5.78962 18.2104 0.757125 12 0.75ZM12.9739 5.25863L12.7582 14.6336C12.7537 14.8372 12.5872 15 12.3832 15H11.6164C11.4127 15 11.2463 14.8372 11.2414 14.6336L11.0258 5.25863C11.0209 5.04825 11.19 4.875 11.4008 4.875H12.5989C12.8092 4.875 12.9788 5.04825 12.9739 5.25863ZM12 19.125C11.3786 19.125 10.875 18.6214 10.875 18C10.875 17.3786 11.3786 16.875 12 16.875C12.6214 16.875 13.125 17.3786 13.125 18C13.125 18.6214 12.6214 19.125 12 19.125Z" fill="#3F64E7"/>
        </g>
        <defs>
          <clipPath id="clip0_1571_3759">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
    
    <div className="alert-dialog">
      <div className="alert-title">Check your e-mail</div>
      {props.children}
    </div>
  </div>
);

Alert.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node,
};

Alert.defaultProps = {
  className: undefined,
  icon: undefined,
  children: undefined,
};

export default Alert;
