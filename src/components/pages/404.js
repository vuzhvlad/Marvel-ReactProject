import ErrorMessage from "../errorMessage/ErrorMsg";
import {Link} from 'react-router-dom';


const Page404 = () => {
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page does not exist</p>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px', 'color': '#9f0013'}} to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;