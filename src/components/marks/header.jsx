import 'bootstrap/dist/css/bootstrap.min.css';
import react, {useEffect} from "react";

function header({address}){

    return(
        <div className="px-4 header">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <div className="col-md-3 mb-2 mb-md-0">
                <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                men·u·niversity
                </a>
            </div>

            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li><a href="/" className="nav-link px-2 link-secondary">{address.locality}</a></li>

            </ul>

            <div className="col-md-3 text-end">
                {/* <button type="button" className="btn btn-outline-primary me-2">Login</button> */}
                {/* <button type="button" className="btn btn-primary">Sign-up</button> */}
            </div>
            </header>
        </div>
    )

}


export default header;