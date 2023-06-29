import { Box, useMediaQuery, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import Footer from "scenes/footer";
import CoursesWidget from "scenes/widgets/CoursesWidget";
import { useState } from "react";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { _id } = useSelector((state) => state.user);

  const [searchText, setSearchText] = useState(""); // Add state for searchText
  const [showInfoText, setShowInfoText] = useState(false); // Add state for showing/hiding the informational text

  const handleSearchChange = (text) => {
    setSearchText(text); // Update the state when searchText changes
  };

  const toggleInfoText = () => {
    setShowInfoText((prev) => !prev); // Toggle the state for showing/hiding the informational text
  };

  return (
    <Box>
      <Navbar onSearch={handleSearchChange} /> {/* Pass the search handler function */}
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} />

          {showInfoText && (
            <Typography
              padding="13px"
              fontWeight="bold"
              textAlign="center"
              fontSize={isNonMobileScreens ? "clamp(.8rem, .8rem, .8rem)" : "1rem"}
              color="primary"
            >
              Simply search and subscribe for the class you are interested in!
              Once subscribed, you will receive a confirmation email. When an open
              seat becomes available, you will receive an email or text message if
              you included your SMS number.
            </Typography>
          )}
          <Box display="flex" justifyContent="center" padding={"20px"}>
            <Button onClick={toggleInfoText} color="primary" variant="outlined">
              {showInfoText ? "Hide" : "How To Use"}
            </Button>
          </Box>
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "calc(74% - 1rem)" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          display="flex"
          flexDirection="column"
          gap="1rem"
        >
          <CoursesWidget userId={_id} isProfile={false} searchText={searchText} />
        </Box>

        {isNonMobileScreens && <Box flexBasis="1rem" />}
      </Box>
      <Box
        width="100%"
        padding="2rem 6% 8rem"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default HomePage;
