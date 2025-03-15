


function priceDrop({onChange}){
    return(
        <div>
            <label htmlFor="price">Choose a price range:</label>
            <select name="price" id="price" className="dropdown" onChange={onChange}>
                <option value="">None</option>
                <option value="$">$0-15</option>
                <option value="$$">$15-25</option>
                <option value="$$$">$25-35</option>
                <option value="$$$$">$35 or more</option>
            </select>
        </div>
    )
}

export default priceDrop;