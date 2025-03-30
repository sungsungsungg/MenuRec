import { useState, useEffect } from 'react'
import axios from "axios"
import https from "https"
import { loadGoogleMapsScript, getCoordinates, getDistance } from "./coordinate.js";
import HomePage from "./pages/home.jsx";
import SearchPage from "./pages/search.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./marks/header.jsx"
import Cookies from 'js-cookie';


function App() {

  const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://menuniversity-eb11d8199881.herokuapp.com/api/' 
  : 'http://localhost:3000/api/'; // Local development


  let started = 0;

  const [selectedAddress, setSelectedAddress] = useState({
    location: "",
    locality: "",
    state: "",
    postalCode: "",
    country: "",
    coordinates: {},
  });
  
  const [formData, setFormData] = useState(getCookieForm()||{
    category: "",
    ingredient: "",
    minPrice: "0",
    maxPrice: "100",
    coordinates: selectedAddress?.coordinates||{},
    sortBy: "rating",
    changed: 0,
  });


  const [addressData, setAddressData] = useState({
    selectedAddress: {}
  })

  const [recData, setRecData] = useState([]);

  

  const [coordinates, setCoordinates] = useState(null);


  function setCookieForm(form){
      Cookies.set('formCookie',JSON.stringify(form),{expires:1});
    }
  function getCookieForm(){
    const cookieValue = Cookies.get('formCookie');
    return cookieValue?JSON.parse(cookieValue):null;
  }
  
  
    useEffect(()=>{
      if(getCookieForm()){
        setFormData({...getCookieForm(), category: "", ingredient: "", minPrice: '0', maxPrice:"100", sortBy: "rating"});
        // console.log("cookie address: ",getCookieAddress());
        // setSelectedAddress(getCookieAddress());
      }
    },[])
  
  
  
  
    useEffect(()=>{
      if(formData){
        setCookieForm(formData);
        // console.log("update cookie2: ",selectedAddress);
      }
    },[formData]);

  


  useEffect(()=>{
    
    if(recData && recData.item){
      let sortedRecData = [];

      switch(formData.sortBy){
        case "price":
          sortedRecData = [...recData.item].sort((a,b)=> a.price - b.price);

          break;
        case "reviews":
          sortedRecData = [...recData.item].sort((a,b)=> a.review_count - b.review_count);

          break;
        case "rating": 
          sortedRecData = [...recData.item].sort((a,b)=> a.rating - b.rating);

          break;
        case "distance":
          if(selectedAddress.coordinates){
            sortedRecData = [...recData.item].sort((a,b)=> getDistance(selectedAddress.coordinates,a.coordinates) - getDistance(selectedAddress.coordinates,b.coordinates));
            
          }
          break;
        default:
          break;
      }
      if(sortedRecData.length >0){
        setRecData({...recData, item: sortedRecData});
      }
    }
    // console.log(selectedAddress);
  },[formData.sortBy,formData.changed, selectedAddress.coordinates]);

  const handleAddressSelect = (updatedAddress) => {
    setSelectedAddress(updatedAddress);
  };


  const handleSubmit = (e)=>{
    e.preventDefault();
    addItem();
  }


  const addItem = () => {
    axios.post(`${apiUrl}items`, formData)
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


  const setAddress = async ()=>{
    await axios.post(`${apiUrl}address`, selectedAddress)
      .then(response => {
        if(response.data.selectedAddress.location){
          setAddressData(response.data);
        const addressToGeocode = selectedAddress.location;
        loadGoogleMapsScript("AIzaSyAPFVx-HAzLMMsUFGMo0qXq46GfZWjaXdI") //TODO Hide API
          .then(() => getCoordinates(addressToGeocode))
          .then((coords) => {setCoordinates(coords);
            setSelectedAddress((prev)=>({
              ...prev,
              coordinates: coords,
            }))
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
              recData={recData}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              coordinates={coordinates}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App
