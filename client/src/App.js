import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import UserPage from "scenes/userPage";
import HelpPage from "scenes/helpPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

//import { create } from "@mui/material/styles/createTransitions";


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" 
            element={<HelpPage/>} />
            <Route path="/home" 
            element={isAuth ? <HomePage /> : <Navigate to = "/" replace/>} />
            <Route path="/profile/:userId" 
            element={isAuth ? <UserPage/> : <Navigate to = "/"/>} />
            <Route path="/login"
            element={isAuth ? <HomePage/> : <LoginPage/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
