import { useState, useEffect } from 'react'
import Category from './options/Category.jsx'
import Ingredient from "./options/Ingredient.jsx"
import RecList from "./recList.jsx"
import AddressSearch from "./addressSearch.jsx"
import Price from "./options/Price.jsx"
import SortBy from "./options/SortBy.jsx"
import axios from "axios"
import https from "https"
import { loadGoogleMapsScript, getCoordinates, getDistance } from "./coordinate.js";
import HomePage from "./pages/home.jsx";
import SearchPage from "./pages/search.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./marks/header.jsx"



function App() {

  let started = 0;

  const [formData, setFormData] = useState({
    category: "",
    ingredient: "",
    price: "None",
    minPrice: "0",
    maxPrice: "100",
    coordinates: {lat: 40.730387, lng: -73.9825791},
    sortBy: "rating",
    changed: 0,
  });

  const [addressData, setAddressData] = useState({
    selectedAddress: {}
  })

  const [recData, setRecData] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState({
    location: "",
    locality: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [coordinates, setCoordinates] = useState(null);



  useEffect(()=>{
    
    if(recData && recData.item){
      let sortedRecData = [];
      sortedRecData = [...recData.item].sort((a,b)=> a.rating - b.rating);
      setRecData({...recData, item: sortedRecData});
      switch(formData.sortBy){
        case "price":
          sortedRecData = [...recData.item].sort((a,b)=> a.price - b.price);
          setRecData({...recData, item: sortedRecData});
          break;
        case "reviews":
          sortedRecData = [...recData.item].sort((a,b)=> a.reviews - b.reviews);
          setRecData({...recData, item: sortedRecData});
          break;
        case "rating": 
          sortedRecData = [...recData.item].sort((a,b)=> a.rating - b.rating);
          setRecData({...recData, item: sortedRecData});
          break;
        case "distance":
          if(coordinates){
            sortedRecData = [...recData.item].sort((a,b)=> getDistance(coordinates,a.coordinates) - getDistance(coordinates,b.coordinates));
            setRecData({...recData, item: sortedRecData});
          }
          break;
    }
    }
  },[formData.sortBy,formData.changed]);

  const handleAddressSelect = (updatedAddress) => {
    setSelectedAddress(updatedAddress);
  };


  const handleSubmit = (e)=>{
    e.preventDefault();
    addItem();
  }


  const addItem = () => {
    axios.post('http://localhost:3000/api/items', formData)
      .then(response => {
        setRecData(response.data);
        setFormData((prev)=>({
          ...prev,
          changed: prev.changed+1,
        }))
        // console.log('Item added:', formData);
      })
      .catch(error => {
        console.error('Error adding item:', error);
      });
  };

  const handleSubmitAddress = (e) =>{
    e.preventDefault();
    setAddress();
  }

  useEffect(() => {
    if (coordinates) { 
        setFormData((prev) => ({
            ...prev,
            coordinates: coordinates // Ensure coordinates updates first
        }));
    }
}, [coordinates]); // Runs whenever coordinates update

useEffect(()=>{
  if(formData.changed>1){
    addItem();
  }else{
    setFormData((prev)=>({
      ...prev,
      changed: prev.changed+1
    }));
  }
},[formData.category,formData.ingredient]);

  const setAddress = async ()=>{
    await axios.post('http://localhost:3000/api/address', selectedAddress)
      .then(response => {
        if(response.data.selectedAddress.location){
          setAddressData(response.data);
        const addressToGeocode = selectedAddress.location;
        loadGoogleMapsScript("AIzaSyAPFVx-HAzLMMsUFGMo0qXq46GfZWjaXdI") //TODO Hide API
          .then(() => getCoordinates(addressToGeocode))
          .then((coords) => {setCoordinates(coords);
            setFormData((prev)=>({
              ...prev,
              changed: prev.changed+1,
            }))
          })
          .catch((error) => console.error(error));
        }
        
      })
      .catch(error => {
        console.error('Error adding item:', error);
      });
  }


  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]: value
    }));
  };



  return (
    <Router>
      <Routes>
        {/* Define routes for HomePage and OtherPage */}
        <Route
          path="/"
          element={
            
            <HomePage
              selectedAddress={selectedAddress}
              onAddressSelect={handleAddressSelect}
              handleSubmitAddress={handleSubmitAddress}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchPage
              formData={formData}
              recData={recData}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              coordinates={coordinates}
              selectedAddress={selectedAddress}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App
