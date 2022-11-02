import { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const ctx = useContext(AuthContext);
  const history = useHistory();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler =(e)=>{
    e.preventDefault();
      const enteredEmail= emailInputRef.current.value;
      const enteredPassword= passwordInputRef.current.value;

      // optional validation
      setIsLoading(true);
      let url;
    if (isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAuuWxHAZ1zdrtnRKKwIpzekRFMrLAIN58'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAuuWxHAZ1zdrtnRKKwIpzekRFMrLAIN58'
    }
      fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setIsLoading(false);
      if (res.ok) {
        return res.json();
        //handle success response
      } else {
       return res.json().then((data) =>{
          let errorMessage = 'Authentication failed';
          throw new Error(errorMessage);
        })
      }
    }).then((data) => {
      // console.log(data)
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000)).toString();
      ctx.login(data.idToken, expirationTime);
      history.replace('/')
    })
      .catch(err =>{
        alert(err.message);
    });
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          
         {!isLoading &&
          (  <button
              type='button'
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>)
          }
        </div>
      </form>
    </section>
  );
};

export default AuthForm;