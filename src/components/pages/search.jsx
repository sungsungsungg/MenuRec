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

function SearchPage({ formData, recData, handleSubmit, handleChange, coordinates, selectedAddress }) {

  // const rendered = useRef(false);

  const navigate = useNavigate();


  const [menuPage, setMenuPage] = useState(0);


  const navigateToHome = () => {
    if(getCookie()){
      navigate('/');  // Navigate to the other page
    }
  };

  const setCookieAddress = (add) => {
    // console.log("cookie set: ", JSON.stringify(add));
    Cookies.set('addressCookie',JSON.stringify(add),{expires:1});
  }
  const getCookieAddress = () => {
    const cookieValue = Cookies.get('addressCookie');
    // console.log("Cookie Address: ", cookieValue);
    return cookieValue?JSON.parse(cookieValue):null;
  }


  const setCookie = (coord) => {
    // console.log("cookie set: ", JSON.stringify(coord));
    Cookies.set('userCookie',JSON.stringify(coord),{expires:1});
  }

  const getCookie = () => {
    const cookieValue = Cookies.get('userCookie');
    return cookieValue?JSON.parse(cookieValue):null;
  }

  // const [coord,setCoord] = useState(getCookie()||{});

  // useEffect(()=>{
  //   if(!rendered.current){
  //     if(!getCookie()){
  //       navigateToHome();
  //     }else{
  //       setCoord(getCookie());
  //       // console.log(coordinates);
  //     }
  //   }else{
  //     if(coordinates){
  //       setCookie(coordinates);
  //     }
      
  //   }
  //   rendered.current = true;
  // },[coordinates]);

  const [address, setAddress] = useState(getCookieAddress() || selectedAddress || "");

  useEffect(()=>{
    // setCoord(getCookie()||{});
    if(getCookieAddress()){
      setAddress(getCookieAddress());
    }
    // setAddress(getCookieAddress()||"");
  },[])

  // useEffect(()=>{
  //   if(coordinates&&coordinates.lat){
  //     setCoord(coordinates);
  //     setCookie(coordinates);
  //   }
  // })



  useEffect(()=>{
    if(selectedAddress.locality){
      setCookieAddress(selectedAddress);
      setAddress(selectedAddress);
    }
  },[selectedAddress.locality]);



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
      <Header selectedAddress={address}/>


      
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
