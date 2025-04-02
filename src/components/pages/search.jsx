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
import Footer from "../marks/footer.jsx"

function SearchPage({ recData, handleSubmit, handleChange, coordinates, selectedAddress, setSelectedAddress }) {


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
      setCookieAddress(selectedAddress);
      setAddress(selectedAddress);
    }else if(getCookieAddress()){
      setAddress(getCookieAddress());
      setSelectedAddress(getCookieAddress());
    }else{
        alert("Invalid Address");
        navigateToHome();
    }
  },[])




  useEffect(()=>{
    if(selectedAddress.locality){
      setCookieAddress(selectedAddress);
      setAddress(selectedAddress);
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

  const createPage = ()=>{
    let firstPage = Math.floor(menuPage/10)*10 +1;
    let lastPage = (firstPage+9<recData.item.length/10)?firstPage+9:Math.floor(recData.item.length/10+1);
    let pageList = [];
    for(let i=firstPage;i<=lastPage;i++){
      if((i===firstPage&&firstPage/10>=1)){
        pageList.push("..");
      }
      pageList.push(i);
      if((i)%10===0 && lastPage<recData.item.length/10){
        pageList.push("...");
      }
    }
    return pageList;
  };

  const createPageNumber =(number)=>{
    if(Number.isInteger(number)){

      if(number===menuPage+1){
        return (
          <button
            key={number}
            className ="page-number pageButton"
            value={number}
            onClick={()=> setPage(number-1)}
            style={{color:"#EF9651"}}
          >
            {number}
          </button>
        )
      }

      return (<button
        key={number}
        className ="page-number pageButton"
        value={number}
        onClick={()=> setPage(number-1)}
      >
        {number}
      </button>)
      
    }else{
      let newNumber=Math.floor(menuPage/10)*10+10;
      if(number==="..") newNumber = Math.floor(menuPage/10)*10-1;
      return (
        <button
          key={number}
          value={newNumber}
          className = "page-number pageButton"
          onClick={()=>setPage(newNumber)}
        >
          {number}
        </button>
      )
      
    }
  }

  
  function setPage(page){
    setMenuPage(page);
  }

  function firstPage(){
    // console.log("resetting to the first page");
    setMenuPage(0);
  }

  function previousPage(){
    if(menuPage>0){
      setMenuPage((prev)=>prev-1);
    }
  }

  function lastPage(){
    setMenuPage(Math.floor(recData.item.length/10));
  }


  function nextPage(){
    if(menuPage<Math.floor(recData.item.length/10)){
      setMenuPage((prev)=>prev+1);
    }
  }

  return (
       <div className="whole" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        

        <Header address={address?.locality||" "}/>
        
        <div className="search" style={{flex:1}}>
          
        <form onSubmit={handleSubmit}>
          <Category onChange={handleChange}/>
          <Ingredient onChange={handleChange} />
          <Price onChange={handleChange} />
          <button type="submit" onClick={firstPage}>Apply</button>
        </form>

        <div style={{display:'flex', flexDirection: 'column'}}>
          <div className="container-menu">
          {recData.item?(recData.item.length>0?<button className="pageButton" onClick={firstPage}> &lt;&lt;</button>:null):null}
            {recData.item?(recData.item.length>0?<button className="pageButton" onClick={previousPage}> &lt;</button>:null):null}
            {recData.item?(recData.item.length>0?createPage().map(createPageNumber):null):null}
            {recData.item?(recData.item.length>0?<button className= "pageButton" onClick={nextPage}>&gt;</button>:null):null}
            {recData.item?(recData.item.length>0?<button className= "pageButton" onClick={lastPage}>&gt;&gt;</button>:null):null}
            
          </div>
          <br/>
            {recData.item?(recData.item.length>0? <SortBy onChange={handleChange}/>:null):null}
          <br/>
            <div>
            {recData.item ? (recData.item.length>0? recData.item.slice(menuPage*10,menuPage*10+10).map(createList):"No list available") : "Select your option"}
            </div>
            <div className="container-menu" style={{margin: "3em"}}>
            {recData.item?(recData.item.length>0?<button className="pageButton" onClick={firstPage}> &lt;&lt;</button>:null):null}
            {recData.item?(recData.item.length>0?<button className="pageButton" onClick={previousPage}> &lt;</button>:null):null}
            {recData.item?(recData.item.length>0?createPage().map(createPageNumber):null):null}
            {recData.item?(recData.item.length>0?<button className= "pageButton" onClick={nextPage}>&gt;</button>:null):null}
            {recData.item?(recData.item.length>0?<button className= "pageButton" onClick={lastPage}>&gt;&gt;</button>:null):null}
          </div>
          </div>
        
        

      </div>
    

      <Footer />
    </div>

    
  );
}

export default SearchPage;
