import { useState, useEffect, useRef } from 'react';
import { fetchRadioStation } from './radioService.js';

const useRadio = (countryName) => {
  const [radioStation, setRadioStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchStation = async () => {
      const station = await fetchRadioStation(countryName);
      setRadioStation(station);
    };

    fetchStation();

    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, [countryName]);

  const toggleRadio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else if (radioStation) {
      audioRef.current.src = radioStation.url;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return { isPlaying, toggleRadio };
};

export default useRadio;