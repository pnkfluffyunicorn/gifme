import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../../../utils/errorMessage';
import '../../../CSS/Signup.css';

const Login = () => {
	const [formData, setFormData] = useState({email:'', password:''});
    const [error, setError] = useState('');
    const [link, setLink] = useState('');

    const {email, password} = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value});
    
    const onLinkRegistration = e => {setLink([e.target.name])}

    const onSubmit = async e => {
        e.preventDefault();
        const loginInfo = {email, password}

        try {
            const config = {
                headers:{
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(loginInfo);
            await axios.post('/api/auth', body, config)
            //this shows the returned value either token or error message
            .then(res=>{
                const myToken = res.data.token;
                localStorage.setItem('myToken', myToken);
                window.location.href = '/';
            })
        } catch (err) {
        //    const error = await err.response.data;
            console.log(err.response.data);
			setError(err.response.data.toString());
		}
    }
    return <div>
        <div className="outside-container">
        <div className="container-form">
        <div className="form">
            <form onSubmit={e => onSubmit(e)} className="form-box">
                <input name="email"
                type="text"
                value={email}
                onChange={e => onChange(e)}
                placeholder="Your email"
                className="input"/>

                <input name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                maxLength="6"
                placeholder="Your
                password"
                className="input"/>

				<ErrorMessage text={error}/>

                <input
                type="submit"
                value="Sign in"
                className="sign-bottom"/>
            </form>
            <p>
                Don't have an account? <Link to='/Signup'>Sign Up</Link>
            </p>
            <div className="links">
                <img className="google" name="google API" onClick={e => onLinkRegistration(e)} src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google link" />
                <p className="google_text">Sign in with Google account</p>
                <LinkRegistration name={link}/>
            </div>
        </div>
        </div>
    </div>
    </div>;
};

const LinkRegistration = ({name}) => {
    if (name) {
    return (
    <div>Event links to {name}</div>
    )} else {return <div></div>}
}

export default Login;