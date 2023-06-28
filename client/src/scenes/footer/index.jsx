import { IconButton, Typography } from "@mui/material";
import { Box,  useTheme} from "@mui/material";
import { GitHub, LinkedIn, Favorite} from "@mui/icons-material";

const Footer = () => {
    const theme = useTheme();
    const background = theme.palette.background.default;
    const alt = theme.palette.background.alt;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
      textAlign="center"
      backgroundColor={background}
      padding="1rem"
      
    >
      <Box
        display="inline-block"
        backgroundColor={alt}
        borderRadius="6px"
        padding="0.35rem"
        
      >
        <Typography variant="body2">
          Made By: Jonathan Schlueche
        </Typography>
        
        <Typography variant="body2">
        <IconButton
            component="a"
            href="https://www.linkedin.com/in/jonathan-schluesche-7a1a94252/"
            target="_blank"
            rel="noopener noreferrer"
            > <LinkedIn/> </IconButton>{" "}

            <IconButton
            component="a"
            href="https://github.com/JSlush611?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            > <GitHub/>
          </IconButton>{" "}

          <IconButton
            component="a"
            href="https://account.venmo.com/u/jonnyschluesche"
            target="_blank"
            rel="noopener noreferrer"
            > <Favorite/>
          </IconButton>{" "}

        </Typography>
        <Typography variant="body2">Unaffiliated with UW Madison</Typography>
        <Typography variant="body2">© 2023</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
