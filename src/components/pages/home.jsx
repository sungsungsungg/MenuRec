import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSearch from "../addressSearch.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage({ selectedAddress, onAddressSelect, handleSubmitAddress }) {
  const navigate = useNavigate();

  const navigateToOtherPage = () => {
    if(selectedAddress.location){
      navigate('/search');  // Navigate to the other page
    }
    
  };

  //men·u·niversity

  return (
    <div className="home text-secondary px-4 py-5 text-center">
      <div 
      className="py-5"
      >
        <h1 className = "display-5 fw-bold text-white">Find Your Cravings!</h1>
        <div className="col-lg-6 mx-auto">
          <p className="fs-5 mb-4">Stuck on Menu? Let us help you!</p>

        </div>
        {/* Address Search Form */}
        <form onSubmit={handleSubmitAddress}>
          <AddressSearch onChange={onAddressSelect} selectedAddress={selectedAddress} onAddressSelect={onAddressSelect} value={selectedAddress}/>
          <button type="submit"
          className="btn btn-outline-light btn-lg px-4 me-sm-3 fw-bold"
          onClick={navigateToOtherPage}>Explore</button>
        </form>

        <br />
      </div>
      
    </div>
  );
}

export default HomePage;
