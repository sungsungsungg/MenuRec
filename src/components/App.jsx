import { useState, useEffect } from 'react'
import Category from './options/Category.jsx'
import Ingredient from "./options/Ingredient.jsx"
import RecList from "./recList.jsx"
import AddressSearch from "./addressSearch.jsx"
import Price from "./options/Price.jsx"
import axios from "axios"
import { loadGoogleMapsScript, getCoordinates, getDistance } from "./coordinate.js";




function App() {

  const [formData, setFormData] = useState({
    category: "",
    ingredient: "",
    price: "",
    coordinates: {lat: 40.730387, lng: -73.9825791},
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

  const handleAddressSelect = (updatedAddress) => {
    setSelectedAddress(updatedAddress);
  };

  function createList(restaurant_list){
    // console.log(coordinates);
    // console.log(restaurant_list.coordinates)
    // console.log(getDistance(coordinates,restaurant_list.coordinates));
    return (<RecList
      key={restaurant_list.menu_id}
      id={restaurant_list.menu_id}
      price={"$ "+restaurant_list.price}
      name={restaurant_list.name}
      restaurant_name={restaurant_list.restaurant_name}
      location={restaurant_list.location}
      url = {restaurant_list.url}
      distance = {getDistance(coordinates,restaurant_list.coordinates) ? (getDistance(coordinates,restaurant_list.coordinates).toFixed(2) +" mi"):"Set your location"}
    />)
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    addItem();
  }


  const addItem = () => {
    axios.post('http://localhost:3000/api/items', formData)
      .then(response => {
        // console.log("response data: ",response.data);
        setRecData(response.data);
        console.log('Item added:', formData);
      })
      .catch(error => {
        console.error('Error adding item:', error);
      });
  };

  const handleSubmitAddress = (e) =>{
    e.preventDefault();
    setAddress();
    console.log(coordinates);
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
    await axios.post('http://localhost:3000/api/address', selectedAddress)
      .then(response => {
        // console.log("response data: ",response.data);
        setAddressData(response.data);
        // setRecData(response.data);
        // console.log('Item added:', formData);
        const addressToGeocode = selectedAddress.location + ", "+ selectedAddress.locality + ", " + selectedAddress.state;
        loadGoogleMapsScript("AIzaSyAPFVx-HAzLMMsUFGMo0qXq46GfZWjaXdI")
          .then(() => getCoordinates(addressToGeocode))
          .then((coords) => setCoordinates(coords))
          .catch((error) => console.error(error));
        // console.log(coordinates);
        // console.log(addressInString);
        // AddressToCoord(addressInString);
      })
      .catch(error => {
        console.error('Error adding item:', error);
      });
  }


  const handleChange = (e)=>{
    // console.log("hi");
    const {name, value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]: value
    }));
  };


  return (
    <div>
      <div>
      <h1>Google Maps Address Selection</h1>
      {/* Pass selectedAddress state and handler to AddressSelection */}
      <form onSubmit={handleSubmitAddress}>
        <AddressSearch onChange={handleAddressSelect} selectedAddress={selectedAddress} onAddressSelect={handleAddressSelect} value={selectedAddress}/>
        <button type="submit">Apply</button>
      </form>
     
     <br />
      
    </div>
      <form onSubmit={handleSubmit}>
        <Category onChange={handleChange}/>
        <Ingredient onChange={handleChange} />
        <Price onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      
      {recData.item?recData.item.map(createList):"Select your option"}
    </div>
  )
}

export default App
