import './LoginPage.css';
import logo from '../../assets/logo.svg';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
const LoginPage = () => {
    return ( 
        <div className="loginPage">
            <img src={logo} className='logo' alt="" />
            <div className="form">
                <p className="formTitle">Login</p>
                <div className="inpabel">
                    <label htmlFor="">e-mail</label>
                    <input type="email" name='email' placeholder='email'/>
                </div>
                <div className="inpabel">
                    <label htmlFor="password">password</label>
                    <input type="password" name='password' placeholder='password' />
        
                </div>
                <button type='submit'>Log in</button>
            </div>
        </div>
     );
}
 
export default LoginPage;