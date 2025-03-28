


function recList(props){


    return(
        <div className="note">
            <h1>{props.name}</h1>
            <p>{props.price}</p>
            <ul>
                <li>{props.restaurant_name}</li>
                <li>{props.location.address1}, {props.location.city}</li>
                <li className="button"><a href={props.url}>Yelp Link</a></li>
                <li>{props.distance?props.distance:"Invalid"}</li>
                <li><img src={props.image} height="150px" width="150px"/></li>
            </ul>
        </div>
    )
}

export default recList;