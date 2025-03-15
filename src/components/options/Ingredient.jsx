


function ingredientDrop({onChange}){
    return(
        <div>
            <label htmlFor="ingredient">Choose an ingredient:</label>
            <select name="ingredient" id="ingredient" className="dropdown" onChange={onChange}>
                <option value="">None</option>
                <option value="meat">Any Meat</option>
                <option value="beef">Beef</option>
                <option value="pork">Pork</option>
                <option value="chicken">Chicken</option>
                <option value="vegetable">Vegetable</option>
            </select>
        </div>
    )
}

export default ingredientDrop;