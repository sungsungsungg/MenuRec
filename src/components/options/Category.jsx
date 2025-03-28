


function categoryDrop({onChange}){



    return(
        <div>
            <label htmlFor="categories">Choose a category:&nbsp;</label>
            <select name="category" id="categories" className="dropdown" onChange={onChange}>
                <option value="">None</option>
                <option value="chinese">Chinese</option>
                <option value="korean">Korean</option>
                <option value="italian">Italian</option>
                <option value="japanese">Japanese</option>
                <option value="sandwich">Sandwich</option>
                <option value="ice cream">Ice Cream</option>
                <option value="pizza">Pizza</option>
                <option value="asian">Asian</option>
                <option value="mexican">Mexican</option>
            </select>
        </div>
    )
}

export default categoryDrop;