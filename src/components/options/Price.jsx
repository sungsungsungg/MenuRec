import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function PriceDrop({ onChange }) {
  const [valueOne, setValueOne] = useState(0);
  const [valueTwo, setValueTwo] = useState(100);
  const minGap = 10;

  const sliderOneRef = useRef(null);
  const sliderTwoRef = useRef(null);
  const rangeOneRef = useRef(null);
  const rangeTwoRef = useRef(null);
  const sliderTrackRef = useRef(null);

  // Function to update the slider's background color with a gradient
  const fillColor = () => {
    // Get the percentage positions of the sliders
    const sliderOnePercentage = (parseInt(sliderOneRef.current.value) / 100) * 100;
    const sliderTwoPercentage = (parseInt(sliderTwoRef.current.value) / 100) * 100;

    // Apply the gradient style to the slider track
    sliderTrackRef.current.style.background = `linear-gradient(to right, #dadae5 ${sliderOnePercentage}%, #3264fe ${sliderOnePercentage}%, #3264fe ${sliderTwoPercentage}%, #dadae5 ${sliderTwoPercentage}%)`;
  };

  // Function to handle the first slider's input
  const slideOne = () => {
    if (parseInt(sliderTwoRef.current.value) - parseInt(sliderOneRef.current.value) <= minGap) {
      sliderOneRef.current.value = parseInt(sliderTwoRef.current.value) - minGap;
    }
    setValueOne(sliderOneRef.current.value);
    rangeOneRef.current.textContent = "$"+sliderOneRef.current.value;
    fillColor(); // Update background color
  };

  // Function to handle the second slider's input
  const slideTwo = () => {
    if (parseInt(sliderTwoRef.current.value) - parseInt(sliderOneRef.current.value) <= minGap) {
      sliderTwoRef.current.value = parseInt(sliderOneRef.current.value) + minGap;
    }
    setValueTwo(sliderTwoRef.current.value);
    rangeTwoRef.current.textContent = "$"+sliderTwoRef.current.value;
    if(sliderTwoRef.current.value==100) rangeTwoRef.current.textContent = "$"+sliderTwoRef.current.value +"+";
    fillColor(); // Update background color
  };

  useEffect(() => {
    fillColor(); // Set the initial background color on mount
  }, []);

  return (
    <div>
      <div className="slider-wrapper">
        <div className="slider-values">
          <span>Price: </span>
          <span ref={rangeOneRef}>${valueOne}</span>
          <span> - </span>
          <span ref={rangeTwoRef}>${valueTwo}+</span>
        </div>
        <div className="slider-container">
          <div className="slider-track" ref={sliderTrackRef}></div>
          <label htmlFor="minPrice" ></label>
          <input
            onChange= {onChange}
            id="minPrice"
            name="minPrice"
            ref={sliderOneRef}
            onInput={slideOne}
            type="range"
            className="slider"
            min="0"
            max="100"
            value={valueOne}
          />
          <label htmlFor="maxPrice"></label>
          <input
            onChange= {onChange}
            name="maxPrice"
            id="maxPrice"
            ref={sliderTwoRef}
            onInput={slideTwo}
            type="range"
            className="slider"
            min="0"
            max="100"
            value={valueTwo}
          />
        </div>
      </div>

    </div>
  );
}

export default PriceDrop;
