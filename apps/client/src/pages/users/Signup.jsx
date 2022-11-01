import { Card, Form, Button } from 'react-bootstrap'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const warningText = {
    usernameTooShort: "Username needs to have at least 3 letters!",
    passwordMatch: "Password does not match!",
    usernameTaken: "Username already taken!",
    emailTaken: "Email already taken!"
}

export default function Signup () {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [disableButton, setDisableButton] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setDisableButton(true);
        let myFormData = new FormData(event.target);
        let userLoginObj = Object.fromEntries(myFormData.entries());
        
        let loginIsValid = false;
        
        //conditionals

        if(userLoginObj.username.length < 3){
            setError(warningText.usernameTooShort);
            setDisableButton(false);
            return;
        } else 
        if(userLoginObj.password !== userLoginObj.confirmPassword){
            setError(warningText.passwordMatch);
            setDisableButton(false);
            return;
        } else {
            delete userLoginObj.confirmPassword; //remove confirmPassword from object
            loginIsValid = true;
        }
        

        //* only fire off request when input is valid:
        if(loginIsValid){
            fetch('/api/userlogin', {   method: "POST", 
                                        headers: {
                                            "Content-type": "application/json" //* vvvvv important, otherwise server receives empty object
                                        },
                                        body: JSON.stringify(userLoginObj) 
                                    })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    if(data.msg === "Username already taken"){
                        setError(warningText.usernameTaken);
                    } else 
                    if(data.msg === "Email already taken"){
                        setError(warningText.emailTaken);
                    } else 
                    if(data.msg === "login successful"){
                        return;
                    }
                    setDisableButton(false);
                    return;
                })
        } else {
            setError("no input");
            setDisableButton(false);
        }
    }

    const warningPopup = 
        <div id="passwordHelpBlock" className="form-text ">
            {error === warningText.usernameTooShort ? error :
                error === warningText.passwordMatch ? error : 
                error === warningText.usernameTaken ? error :
                error === warningText.emailTaken ? error : ""
            }
        </div>;

    return(
        <div className="card m-4 p-4" style={{ width: "30rem" }}>
            <h1>Sign Up</h1>
            <Form onSubmit={handleSubmit}>
               
                    <div className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" id="firstname" name="firstname" placeholder="Enter first name" required/>
                    </div>

                    <div className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" id="lastname" name="lastname" placeholder="Enter last name" required/>
                    </div>

                    <div className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" id="username" name="username" placeholder="Enter username" required/>
                        {error === warningText.usernameTooShort ? warningPopup : ""}
                        {error === warningText.usernameTaken ? warningPopup : ""}
                    </div>

                    <div className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" id="email" name="email" placeholder="Enter email address" required/>
                        {error === warningText.emailTaken ? warningPopup : ""}
                    </div>

                    <div className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" id="password" name="password" placeholder="Enter password" required/>
                    </div>

                    <div className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" required/>
                        {error === warningText.passwordMatch ? warningPopup : ""}
                    </div>

                    <div className="mb-3">
                        <Button variant="primary" type="submit" disabled={disableButton}>
                            Sign Up
                        </Button>
                    </div>
       
            </Form>
        </div>
    )
}