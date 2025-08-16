import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/EditProfile.sass";

import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";
import { Label } from "@/components/ui/label";

import imgProfile from "../../img/user.png"
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import Menu from "@/components/Menu";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { loginSuccess } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import CountryList from "@/components/CountryList";
import TimezoneList from "@/components/TimezoneList";
import LanguageList from "@/components/LanguageList";
import { subYears, isBefore } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3).regex(/^[a-z0-9._]+$/),
  bio: z.string().optional(),
  email: z.string().email().min(1),
  country: z.string(),
  timezone: z.string(),
  language: z.string(),
  dob: z
    .string()
    .nonempty({ message: "Campo obrigatório." })
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const eighteenYearsAgo = subYears(new Date(), 18);
        return isBefore(date, eighteenYearsAgo);
      },
      { message: "Você deve ter pelo menos 18 anos de idade." }
  ),
  password: z.string()
    .min(8)
    .refine((value) => /[A-Z]/.test(value))
    .refine((value) => /[a-z]/.test(value))
    .refine((value) => /[0-9]/.test(value))
    .refine((value) => /[\W_]/.test(value)),
  confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
});

const Signup = () => {
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const dispatch = useDispatch()

  const { field: timezoneField } = useController({
    name: "timezone",
    control,
    defaultValue: "America/Sao_Paulo"
  });
  
  const { field: countryField } = useController({
    name: "country",
    control,
  });

  const { field: languageField } = useController({
    name: "language",
    control,
  });

  const [charCount1, setCharCount1] = useState(0);
  const [charCount2, setCharCount2] = useState(0);
  const [charCount3, setCharCount3] = useState(0);

  const charLimit1 = 50;
  const charLimit2 = 15;
  const charLimit3 = 180;

  const [type1, setType1] = useState("password");
  const [type2, setType2] = useState("password");

  const onVerify = (token) => {
    setToken(token);
  };

  const captchaRef = useRef(null);
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const [serverErrorUser, setServerErrorUser] = useState(false);
  const [serverErrorEmail, setServerErrorEmail] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    if (!token) {
      setErrorCaptcha(true);
      setIsSubmitting(false);
      return;
    }

    try {
      setErrorCaptcha(false);
      const response = await axios.post("/api/auth/signup", { name: data.name, username: data.username, email: data.email, password: data.confirmPassword, description: data.bio, dob: data.dob, country: data.country, timezone: data.timezone, language: data.language, captchaToken: token }, { withCredentials: true });
      console.log(response.data);
      const resLogin = await axios.post("/api/auth/signin", { email: data.email, password: data.confirmPassword }, { withCredentials: true });
      dispatch(loginSuccess(resLogin.data));

      navigate(`/${redirectPath}`);
    } catch (err) {
      setIsSubmitting(false);
      if (err.response && err.response.data.error.includes("Username")) {
          setServerErrorUser(true);
      } else {
        setServerErrorUser(false)
      }

      if (err.response && err.response.data.error.includes("Email")) {
          setServerErrorEmail(true);
      } else {
        setServerErrorEmail(false)
      }
    }
  };

  if (currentUser && redirectPath === "/") {
    return <Navigate replace to="/" />;
  }

  if (currentUser && redirectPath !== "/") {
    return <Navigate replace to={`/${redirectPath}`} />;
  }

  return (
    <aside id="EditProfile" className="Container">
      <Loading/>
      <Menu/>
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div className="EditHeader">
        <h1>{t("Crie sua conta")}</h1>

        <div className="imgProfile">
            <img src={imgProfile} alt="" />
          </div>
        </div>

        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>{t("Nome")}</Label>
            <Input id="name" {...register("name")} onChange={
              (e1) => setCharCount1(e1.target.value.length)
            } maxLength={charLimit1}/>
            <div className="detailsInput">
              <label className="error-text">{errors.name && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount1}/{charLimit1}</span>
            </div>
          </div>

          <div>
            <Label>{t("Nome de usuário")}</Label>
            <Input id="username" {...register("username")}placeholder="@" onChange={
              (e1) => setCharCount2(e1.target.value.length)
            } maxLength={charLimit2} />
            <div className="detailsInput">
              <label className="error-text">{errors.username && <span>{t("messageUsername")}</span>}</label>
              <span className="countText colorWhite">{charCount2}/{charLimit2}</span>
            </div>
            <div className="detailsInput">
              <label className="error-text">{serverErrorUser && <span>{t("Este nome de usuário já existe")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Email")}</Label>
            <Input id="email" {...register("email")} type="email" />
            <div className="detailsInput">
              <label className="error-text">{errors.email && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
            {serverErrorEmail &&
            <div className="detailsInput">
              <label className="error-text"><span>{t("Este email já está registrado")}</span></label>
            </div>}
          </div>

          <div>
            <Label>{t("Bio")}</Label>
            <Textarea id="bio" {...register("bio")} onChange={
              (e3) => setCharCount3(e3.target.value.length)
            } maxLength={charLimit3}/>
            <div className="detailsInput">
              <span className="fx1 countText colorWhite">{charCount3}/{charLimit3}</span>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <Label>{t("Data de nascimento")}</Label>
            <Input id="dob" className="w-full" {...register("dob")} type="date" />

            <div className="detailsInput">
              <label className="error-text">{errors.dob && <span>{t("msgErrorDOB")}</span>}</label>
            </div>
          </div>

          <div>
            <LanguageList field={languageField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.language && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <CountryList field={countryField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.country && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <TimezoneList field={timezoneField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.timezone && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Crie uma senha")}</Label>
            <div className="passwordInput">
              <Input id="password" {...register("password")} type={type1} />
              {type1==="password"?(
                <div className="buttonHidden" onClick={()=>setType1("text")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
              ):(
                <div className="buttonHidden" onClick={()=>setType1("password")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="detailsInput">
              <label className="error-text">{errors.password && <span>{t("messagePwd")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Confirme sua senha")}</Label>
            <div className="passwordInput">
              <Input id="confirmPassword" {...register("confirmPassword")} type={type2} />
              {type2==="password"?(
                <div className="buttonHidden" onClick={()=>setType2("text")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
              ):(
                <div className="buttonHidden" onClick={()=>setType2("password")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="detailsInput">
              <label className="error-text">{errors.confirmPassword && <span>{t("As senhas não coincidem")}.</span>}</label>
            </div>
          </div>

          <div>
            <HCaptcha
              sitekey="d7c2933f-9b49-470b-9203-8db3e981707c"
              onVerify={onVerify}
              ref={captchaRef}
            />

            {errorCaptcha && 
              <div className="detailsInput">
                <label className="error-text">{t("Complete o CAPTCHA acima")}.</label>
              </div>          
            }
          </div>

          <div>
            <p className="text-terms">
              {t("Ao continuar, você concorda com os")} <Link to="/i/policies/terms" className="col-3">{t("Termos de uso")}</Link> {t("e a")} <Link to="/i/policies/privacy-cookies" className="col-3">{t("Política de Privacidade e Cookies")}</Link>.
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Continuar")}
          </Button>
        </form>
      </div>
    </aside>
  );
}

export default Signup;
