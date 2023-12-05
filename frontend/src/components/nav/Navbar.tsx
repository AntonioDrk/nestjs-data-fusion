import {
  useNavigate
} from "react-router-dom";
import handleSignout from "../auth/signout";

function Navbar(props: { isLoggedIn: boolean; setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; }) {
  const { isLoggedIn, setIsLoggedIn } = props;

  let navigate = useNavigate();

  return (
    <div className="backdrop-blur-sm bg-gradient-to-t from-red-400 to-red-800 w-full text-slate-50 flex flex-row items-start">
      <button className="font-bold p-2 hover:text-gray-200" onClick={() => { navigate("/") }}>Showcase App</button>
      <div className="flex-grow"></div>
      {isLoggedIn &&
        <div className="self-center justify-self-end px-4">
          <button className="hover:text-gray-200" onClick={() => { navigate("/weather"); }}>Weather Forecast</button>
        </div>}
      <div className="self-center justify-self-end px-4">
        {
          <button className="hover:text-gray-200" onClick={() => {
            if (isLoggedIn) {
              handleSignout(setIsLoggedIn);
              navigate("/");
              return;
            }
            navigate("/signin");
          }}>{isLoggedIn ? "Sign Out" : "Sign In"}</button>
        }
      </div>
    </div >
  );
}

export default Navbar;