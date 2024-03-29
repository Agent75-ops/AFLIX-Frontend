// how do CmntDiv , CommentInput , Comments.js work together ? 
// CommentInput component is where the requests to the server are sent from 
// the information here (that are gained via props) are received from : Comments component if a comment is added ; CmntDiv component if a reply is added 
                                         
// when comment btn is pressed : data are sent to the server then to Comments component via a function that works as a passage for 
// state from a child component(commentInput) to parent component (Comments) , then data is used to display a comment by being rendered 
// in a comment box (CmntDiv is used), and data is preserved to be used when replying
// when reply btn is pressed (located in CmntDiv): a CommentInput is rendered given the preserved data like username_replying_to , which is the username of 
// comment that reply btn belongs to, and reply bool is True.+ another passage function is given as a prop
// When reply in the rendered CommentInput is pressed , a request is sent to the server whith reply = True for the server to differentiate 
// between commnets and replies. 
// the passage funtion setRes() sends data back to the CmntDiv then to Comments component (parent Component) the same way.
// in the Comments component data is used to render a reply div by rendering a CmntDiv with the given data.
//page_id : 
// page_id is given to both comments and replies being rendered is Comment Component and are sent in the request to the database to tell which comment 
// belongs to which movie page, this page_id is provided to the movie.js page when pressing on the movie box (link) and then is passed view props to the 
// commentInput component.
//ids : 
// each comment has an id , and each reply has the id of the comment it belongs to.
// this id is given from the database , and when a comment is added , the id is equal to the length of the state that stores the comments + 1,
// when a reply is rendered  , it is given the id of the comment it is rendered in .
// when reply button is pressed , whether in a cmnt or another reply , the id given formaly to reply (id of the comment) or the comment and stored along with 
// username_replying_to in a state in CmntDiv comp, is passed to commentInput and then back to the parent component along with other data to be used in rendering 
// a new reply.

import {useState } from "react";
import styles from "./Comments.module.css"
import React from "react";
import { useCookies } from "react-cookie";
function CmntInput(props){
    const [cookies, setCookies] = useCookies(["token"])
    const [text , setText] = useState("")
    const getdate = ()=>{
        let date = new Date()
        return date.toISOString().replace(/\.\d*/,'');
    }
    
    function handleCmntSubmit(e){
        e.preventDefault();
        if (text.length <= 0){
            return 0
        }
        let dateAdded = getdate()
        let email = cookies.email
        let username_replying_to =props.username_replying_to 
        let parent_comment_id =props.id
        let page_id = props.page_id
        let pfp = cookies.username[0]
        let data = {
            text,email,dateAdded,username_replying_to,parent_comment_id,page_id,pfp
        }

        async function Comment_Call(data){
            const request = await fetch("http://127.0.0.1:8000/comments/",{
                method:"POST",
                body: JSON.stringify(data), 
                headers :{ 
                    "Content-type":"application/json",
                    "Authorization":"Token "+cookies.token
                },
            })
            const response = await request.json()
            if (request.status == 200 && request.ok ==true){
                props.new_comment_data(response)
            }
        }

        async function Reply_Call(data){
            const request = await fetch("http://127.0.0.1:8000/replies/",{
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    "Content-type":"application/json",
                    "Authorization":"Token "+cookies.token
                }
            })
            const response = await request.json()
            if (request.status == 200 && request.ok == true){
                props.new_reply_data(response)
            }
        }

        if(props.reply){ // check whether the user's input is reply or a comment to call the suitable endpoint
            Reply_Call(data)
        }else{
            Comment_Call(data)
        }
    }
 
    return(
        <form onSubmit={handleCmntSubmit} style={props.style} className={styles.cmntInputForm}>
            {props.reply == false?
            <React.Fragment>
                <textarea placeholder="Join the discussion!" type="text" id="CmntInput" value={text} onChange={(e)=>{setText(e.target.value)}} className={styles.cmntInput}></textarea>
                <div className={styles.submitBtnCont}>
                    <input type="submit" className={styles.cmntInputSubmit} value="comment"></input>
                </div>
            </React.Fragment>
            :
            <React.Fragment>
                <textarea placeholder="Reply" type="text" id="CmntInput" value={text} onChange={(e)=>{setText(e.target.value)}} className={styles.replyInput}></textarea>
                <div className={styles.replyBtnCont}>
                    <input type="submit" className={styles.cmntInputSubmit}  value="reply"></input>
                </div>
            </React.Fragment>
            }
        </form>
    )
}

export default CmntInput;
