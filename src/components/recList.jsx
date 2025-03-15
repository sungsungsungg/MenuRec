


function recList(props){



    return(
        <div>
            <h3>{props.name}</h3>
            <h4>{props.price}</h4>
            <ul>
                <li>{props.restaurant_name}</li>
                <li>{props.location.address1}, {props.location.city}</li>
                <li>{props.url}</li>
                <li>{props.distance?props.distance:"Invalid"}</li>
            </ul>
        </div>
    )
}

export default recList;