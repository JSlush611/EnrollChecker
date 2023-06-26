import React from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { setSubscriptions } from "state";

const CourseWidget = ({
  courseId,
  title,
  credits,
  termCode,
  subjectCode,
  courseID,
  courseDesignation,
  subscribed,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const { palette } = useTheme();
  const primary = palette.primary.main;

  const [isSubscribed, setIsSubscribed] = useState(subscribed);

  const subscribeCourse = async () => {
    const response = await fetch (`http://localhost:3001/courses/subscribe/${loggedInUserId}/${courseId}`,{
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setSubscriptions({courseList: data}));
    
  };

  const unsubscribeCourse = async () => {
    const response = await fetch (`http://localhost:3001/courses/unsubscribe/${loggedInUserId}/${courseId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setSubscriptions({courseList: data}));
  };

  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      await unsubscribeCourse();
    } else {
      await subscribeCourse();
    }
    setIsSubscribed(!isSubscribed); // Toggle the value
  };

  useEffect(() => {
    setIsSubscribed(subscribed);
  }, [subscribed]);

  return (
    <WidgetWrapper>
      <Box p="1rem">
        <Typography variant="h6" sx={{ color: primary }}>
          {title}
        </Typography>
        <Typography variant="body1">{`Credits: ${credits}`}</Typography>
        <Typography variant="body1">{`Course Designation: ${courseDesignation}`}</Typography>
        <Button
          variant="outlined"
          onClick={handleToggleSubscription}
          sx={{ marginTop: "1rem" }}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </Box>
    </WidgetWrapper>
  );
};

export default CourseWidget;
