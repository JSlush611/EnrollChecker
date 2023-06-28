import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import Footer from "scenes/footer"
import CoursesWidget from "scenes/widgets/CoursesWidget";
import { useState } from "react";


const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { _id, picturePath} = useSelector((state) => state.user);

    const [searchText, setSearchText] = useState(""); // Add state for searchText

    const handleSearchChange = (text) => {
      setSearchText(text); // Update the state when searchText changes
    };

    return ( 
    <Box>
      <Navbar onSearch={handleSearchChange} /> {/* Pass the search handler function */}
        <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="0.5rem"
            justifyContent="space-between"
        >
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                <UserWidget userId={_id} picturePath={ picturePath} />
            </Box>

            <Box flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
            display="flex"
            flexDirection="column"
            gap="1rem">
                
          <CoursesWidget userId={_id} isProfile={false} searchText={searchText}/>
            </Box>

            {isNonMobileScreens && <Box flexBasis="26%"></Box>}

        </Box>
        <Box
        width="100%"
        padding="2rem 6% 8rem"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between">
        <Footer/>
        </Box>
        
    </Box>

    
    
    );
}

export default HomePage;