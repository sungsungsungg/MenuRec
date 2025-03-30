import React, {useEffect,useState,useRef, StrictMode} from 'react';
import Ingredient from '../options/Ingredient.jsx';
import Price from '../options/Price.jsx';
import SortBy from '../options/SortBy.jsx';
import RecList from '../recList.jsx';
import Category from "../options/Category.jsx"
import {getDistance} from "../coordinate.js"
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from "../marks/header.jsx"
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchPage({ recData, handleSubmit, handleChange, coordinates, selectedAddress, setSelectedAddress }) {

  const rendered = useRef(false);

  const navigate = useNavigate();


  const [menuPage, setMenuPage] = useState(0);


  const navigateToHome = () => {
      navigate('/');  
  };

  const setCookieAddress = (add) => {
    Cookies.set('addressCookie',JSON.stringify(add),{expires:1});
  }
  const getCookieAddress = () => {
    const cookieValue = Cookies.get('addressCookie');
    return cookieValue?JSON.parse(cookieValue):null;
  }

  


  const [address, setAddress] = useState(getCookieAddress() || selectedAddress || "");

  useEffect(()=>{
    if(selectedAddress.locality){
      // console.log("update cookie: ",selectedAddress);
      setCookieAddress(selectedAddress);
      setAddress(selectedAddress);
    }else if(getCookieAddress()){
      setAddress(getCookieAddress());
      // console.log("cookie address: ",getCookieAddress());
      setSelectedAddress(getCookieAddress());
    }else{
      if(rendered.current){
        alert("Invalid Address");
        navigateToHome();
      }else{
        rendered.current = true;
      }
      
    }
  },[])




  useEffect(()=>{
    if(selectedAddress.locality){
      setCookieAddress(selectedAddress);
      setAddress(selectedAddress);
      // console.log("update cookie2: ",selectedAddress);
    }
  },[selectedAddress]);



  const createList = (restaurant_list) => (
    <RecList
      key={restaurant_list.menu_id}
      id={restaurant_list.menu_id}
      price={"$ " + restaurant_list.price}
      name={restaurant_list.name}
      restaurant_name={restaurant_list.restaurant_name}
      location={restaurant_list.location}
      url={restaurant_list.url}
      distance = {getDistance(address.coordinates,restaurant_list.coordinates) ? (getDistance(address.coordinates,restaurant_list.coordinates).toFixed(2) +" mi"):"Set your location"}
      image={restaurant_list.image_url}
    />
  );

  function previousPage(){
    if(menuPage>0){
      setMenuPage((prev)=>prev-1);
    }
  }

  function nextPage(){
    if(menuPage<Math.floor(recData.item.length/10)){
      setMenuPage((prev)=>prev+1);
    }
  }

  return (
    <StrictMode>
      <Header address={address?.locality||" "}/>


      
      <div className="search">
      <form onSubmit={handleSubmit}>
        <Category onChange={handleChange}/>
        <Ingredient onChange={handleChange} />
        <Price onChange={handleChange} />
        <button type="submit">Apply</button>
      </form>

      
      
      <div className="container">
        {recData.item?<button className="pageButton" onClick={previousPage}> &lt;</button>:null}
        {recData.item?<button className= "pageButton" onClick={nextPage}>&gt;</button>:null}
      </div>
        <br/>
        {recData.item?<SortBy onChange={handleChange} />:null}
        <br/>

        {recData.item ? recData.item.slice(menuPage*10,menuPage*10+10).map(createList) : "Select your option"}
      
    </div>
    
    </StrictMode>
    
  );
}

export default SearchPage;
