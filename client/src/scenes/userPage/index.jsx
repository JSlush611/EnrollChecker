import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import CoursesWidget from "scenes/widgets/CoursesWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const courseList = useSelector((state) => state.courseList);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const hasSubscribedCourses = courseList.length > 0;
  console.log(courseList.length);

  useEffect(() => {
    getUser();
  }, [courseList.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box width="100%" padding="2rem 6%" display="flex" justifyContent="center">
        <Box maxWidth={isNonMobileScreens ? "50%" : "100%"} flexGrow={1}>
          <Box mb={4}>
            <UserWidget userId={userId} />
          </Box>
          {!hasSubscribedCourses && (
            <Typography
              fontWeight="bold"
              color="primary"
              fontSize={isNonMobileScreens ? "clamp(1rem, 2rem, 2.25rem)" : "1.5rem"}
              textAlign="center"
            >
              No subscribed courses.
            </Typography>
          )}
          {hasSubscribedCourses && (
            <CoursesWidget key={courseList.length} userId={userId} isProfile />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
