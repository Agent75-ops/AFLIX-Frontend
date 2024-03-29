import FacebookLogin from "react-facebook-login"
import "./Facebook.css"
//861835401720160
function Facebook(){
    const componentClicked = ()=>{
        console.log("click")
    }
    const responseFacebook = ()=>{
        console.log("response")
    }
    return(
        <FacebookLogin 
            type="button"
            appId="861835401720160"
            autoLoad={false}
            fields="name,email,picture"
            onClick={componentClicked}
            callback={responseFacebook}
            cssClass="btnFacebook"
            icon={<i style={{marginRight:"2px"}} className="fa fa-facebook"> </i>}
            textButton = "&nbsp;Facebook" 
        />
    )
}

export default Facebook;