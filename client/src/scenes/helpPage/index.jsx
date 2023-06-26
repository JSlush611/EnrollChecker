import { useState } from "react";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { Box, Typography, Button, Collapse } from "@mui/material";
import { Link } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "scenes/navbar";

const HelpPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const user = useSelector((state) => state.user);
  const preferredName = user ? `, ${user.preferredName}` : "";
  const isAuth = Boolean(useSelector((state) => state.token));
  const notAuth = isAuth ? "" : (
  <React.Fragment>
      It looks like you aren't signed up or logged in!
      Please <Link component={RouterLink} to="/"><b>login or create an account</b></Link>.
  </React.Fragment>
  );

  const questions = [
    {
      question: "How do I sign up to get notifications?",
      answer: <React.Fragment>
        To sign up and receive notifications, follow these simple steps:
        
        <br/><br/>1. Register or log in to your account.
        <br/>2. Navigate to the home page.
        <br/>3. Use the search feature to find the class you're interested in.
        <br/>4. Click on the 'Subscribe' button next to the class.
        
        <br/><br/>That's it! You're now subscribed to receive notifications.
        
        <br/><br/>Once you're subscribed, our system will monitor the class availability for you.
        If a seat becomes available, you will promptly receive a notification,
        ensuring you never miss an opportunity to enroll in your preferred classes.
        </React.Fragment>
    },
    {
      question: "How does the monitoring work?",
      answer: <React.Fragment>
      Once you are subscribed to a class, our monitoring system will diligently keep track of its availability. 
      Our server will periodically check for any updates regarding seat availability. 
      Rest assured that our monitoring system focuses on real-time changes, specifically for available seats, not waitlist updates.
      If a waitlist seat is added, no alerts will occur. 

      <br/><br/>As soon as a seat becomes available, whether it's due to a student dropping the class or additional seats being added, 
      you will receive an immediate notification via SMS text or email. This real-time notification ensures that you are 
      promptly informed of any openings, maximizing your chances of securing a spot in the class.

      <br/><br/>With our system's focus on actual seat availability, you can rely on receiving accurate and timely notifications, 
      eliminating the frustration of constantly monitoring the class yourself. We understand the importance of staying informed and ensuring 
      you never miss an opportunity to enroll in your preferred classes.
      </React.Fragment>
    },
    {
      question: "How can I get help?",
      answer: "building",
    },
  ];

  const handleToggleAnswer = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* Paragraph box for website explanation */}
        <Box mb={4} textAlign="center" border={1} borderColor="primary.main" borderRadius={8} p={2}>
          <Typography variant="h4" gutterBottom>
            Welcome to Enroll Checker<b>{preferredName}</b>
          </Typography>
          <br/>{notAuth}<br/>

          <Typography variant="body1">
          <br/>
          Enroll Checker is a web application designed to assist UW-Madison students in securing 
          enrollment in highly competitive classes. Our platform eliminates the frustration of missing out on class seat 
          openings by providing real-time notifications via SMS messages or emails.
          <br/><br/> 
          Once subscribed, our system will diligently monitor class availability for you. As soon as a seat becomes available, 
          you will promptly receive a notification, ensuring you never miss an opportunity to enroll in your preferred classes.
          </Typography>
        </Box>
        {/* FAQ toggle spots */}
        {questions.map((faq, index) => (
          <Box width="100%" mb={4} textAlign="center" borderRadius={8} border={1} borderColor="primary.main" overflow="hidden">
            <Button
              variant="body1"
              onClick={() => handleToggleAnswer(index)}
              fullWidth
              size="large"
            >
            {faq.question}
            </Button>
            <Collapse in={expandedIndex === index}>
              <Typography variant="body1" align="center">
                {faq.answer}
              </Typography>
            </Collapse>
            {isNonMobileScreens && <Box flexBasis="26%"></Box>}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HelpPage;
