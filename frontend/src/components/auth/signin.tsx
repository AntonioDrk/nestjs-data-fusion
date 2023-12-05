import axios, { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const SIGNIN_URL = "http://localhost:3300/auth/signin";

export default function SignIn(props: { isLoggedIn: boolean | null | undefined; setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {

  const { isLoggedIn, setIsLoggedIn } = props;
  const [errrorMessage, setErrorMessage] = React.useState("");

  let navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      const req = await axios.post(SIGNIN_URL, form);

      if (req.status === parseInt("200")) {
        console.log(req.data);

        localStorage.setItem("token", req.data.access_token);
        setIsLoggedIn(true);
        navigate("/");
      }

    } catch (error) {
      let err = error as AxiosError;
      console.error(`Calling ${SIGNIN_URL} received ${err.message}`);
      console.log(err.response);
      setErrorMessage(err.message);
      if (err.cause) {
        console.error();
      }
    }
  }

  return (
    isLoggedIn ? <div className="text-4xl">You're already logged in </div>
      :
      <div>
        <h2 className="text-3xl">Sign In Form</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center pt-10 gap-8">
          <div className="flex flex-col items-start">
            <label htmlFor="emailInputId" className="font-bold">Email:</label>
            <input id="emailInputId" type="email" name="email" placeholder="your@email.address" className="border border-gray-200 rounded-md px-2" />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="passwordInputId" className="font-bold">Password:</label>
            <input id="passwordInputId" type="password" name="password" placeholder="*******" className="border border-gray-200 rounded-md px-2" />
          </div>
          <button type="submit" className="bg-slate-100 w-24 rounded-md hover:bg-slate-200">Log In</button>
        </form>
        {errrorMessage && <footer className="text-red-600 pt-6">An error has appeared, please try again</footer>}
      </div>
  )
}