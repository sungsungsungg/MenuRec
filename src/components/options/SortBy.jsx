


function sortBy({onChange}){
    return(
        <div  className ="sortBy">
            <label htmlFor="sortBy">Sort By&nbsp;</label>
            <select name="sortBy" id="sortBy" className="dropdown" onChange={onChange}>
                <option value="rating">Rating</option>
                <option value="reviews">Reviews</option>
                <option value="price">Price</option>
                <option value="distance">Distance</option>
            </select>
        </div>
    )
}

export default sortBy;