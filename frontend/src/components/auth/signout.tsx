const handleSignout = (setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>) => {
  localStorage.removeItem("token");
  setIsLoggedIn(false);
}

export default handleSignout;