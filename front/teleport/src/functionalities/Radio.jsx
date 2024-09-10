import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRadio } from '@fortawesome/free-solid-svg-icons';
import '../constants/RadioIcon.scss';

const RadioIcon = ({ isPlaying, onClick }) => (
  <div className="radio-icon" onClick={onClick}>
    <FontAwesomeIcon icon={faRadio} color={isPlaying ? "green" : "white"} />
  </div>
);

export default RadioIcon;