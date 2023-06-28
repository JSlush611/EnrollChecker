import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate, useLocation } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import Logo from "./logo.png";
import { Link as RouterLink } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const isAuth = Boolean(useSelector((state) => state.token));

  const preferredName = user ? `${user.preferredName}` : "";

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue); // Update the search text
    onSearch(searchValue); // Call the onSearch prop with the search value
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem" flex="1">
        <Typography
          fontWeight="bold"
          fontSize={isNonMobileScreens ? "clamp(1rem, 2rem, 2.25rem)" : "1.5rem"}
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          <img
            src={Logo}
            alt=""
            style={{
              marginRight: isNonMobileScreens ? "0.25rem" : "0.1rem",
              verticalAlign: "middle",
            }}
            width={isNonMobileScreens ? "150" : "120"}
            height={isNonMobileScreens ? "90" : "80"}
          />{" "}
          {/* Logo image */}
        </Typography>
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="9px"
          gap="1.5rem"
          padding="0.1rem 1rem"
          flex="1"
        >
          <InputBase
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            sx={{
              fontSize: isNonMobileScreens ? "1rem" : "0.875rem",
              width: "100%",
            }}
          />
          <IconButton onClick={() => setSearchText("")}>
            <Search sx={{ fontSize: isNonMobileScreens ? "1.5rem" : "1rem" }} />
          </IconButton>
        </FlexBetween>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())} >
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>

          {/* Help button */}
          <IconButton
            onClick={() =>
              navigate(location.pathname === "/help" ? "/home" : "/help")
            }
          >
            {theme.palette.mode === "dark" ? (
              <Help sx={{ fontSize: "25px", color: dark }} />
            ) : (
              <Help sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          <FormControl variant="standard" value={preferredName} >
            <Select
              value={preferredName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={preferredName}>
                <Typography>{preferredName}</Typography>
              </MenuItem>
              {isAuth ? (
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              ) : (
                <MenuItem component={RouterLink} to="/">
                  Login
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            {/* Theme button */}
            <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>

            {/* Help button */}
            <IconButton
              onClick={() =>
                navigate(location.pathname === "/help" ? "/home" : "/help")
              }
            >
              {theme.palette.mode === "dark" ? (
                <Help sx={{ fontSize: "25px", color: dark }} />
              ) : (
                <Help sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
            <FormControl variant="standard" value={preferredName}>
              <Select
                value={preferredName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={preferredName}>
                  <Typography>{preferredName}</Typography>
                </MenuItem>
                {isAuth ? (
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                ) : (
                  <MenuItem component={RouterLink} to="/">
                    Login
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
