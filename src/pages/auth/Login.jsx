import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Login.sass";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Mail } from "lucide-react";

// import Xsocial from "../../img/x-social.svg"
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";

// import { loginSuccess } from "../../redux/userSlice";
// import { useDispatch } from "react-redux";

// import { auth } from '../../components/firebaseConfig.jsx';
// import {TwitterAuthProvider, signInWithPopup} from 'firebase/auth';
// import axios from "axios";
// import { useState } from "react";

const Login = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch()
  // const navigate = useNavigate();
  const queryParams = location.search.split("?")[1];
  // const [isDisabled, setIsDisabled] = useState(false);

  // const handleTwitterLogin = async () => {
  //   const provider = new TwitterAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const credential = TwitterAuthProvider.credentialFromResult(result);
  //     const { accessToken, secret } = credential;

  //     setIsDisabled(true);

  //     const user = result.user;
      
  //     const userImgOriginal = user.photoURL;
  //     const userImg = userImgOriginal.replace("normal", "400x400");

  //     const res = await axios.post("/api/auth/signinX", 
  //     { name: user.displayName, authX: user.uid, img: userImg, accessToken, secret }); 
  //     dispatch(loginSuccess(res.data));
  //     navigate("/");
  //   } catch (error) {
  //     setIsDisabled(false);
  //     console.error('Erro ao fazer login com Twitter:', error);
  //   }
  // }; 

  return (
    <aside id="Login" className="Container">    
      <Helmet>
        <title>Login / SocialApp</title>
      </Helmet>

      <Menu/>
  
      <div className="Main">
          <div className="buttonItens">
            {/* <Button className="login-x" disabled={isDisabled} onClick={handleTwitterLogin}>
              {t("Entrar com o")}
              <img src={Xsocial} className="h-5 w-5" alt="" />
            </Button> */}
            
            <Link to={`/auth/login-email${queryParams ? `?${queryParams}` : ''}`}>
              <Button className="login-email">
                <Mail className="h-5 w-5" />
                {t("Entrar com o")} email
              </Button>
            </Link>
          </div>
      </div>
    </aside>
  );
}

export default Login;
