import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import CoursesWidget from "scenes/widgets/CoursesWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [preferredName, setPreferredName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    setPreferredName(data.preferredName);
    setPhoneNumber(data.phoneNumber);
  };

  const handleUpdateProfile = async () => {
    if (preferredName.trim().length < 2 || preferredName.trim().length > 50) {
      console.log("Preferred name is not valid");
      return;
    }
    if (!/^[A-Za-z]+$/.test(preferredName)) {
      console.log("Preferred name contains invalid characters");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      console.log("Phone number is not valid");
      return;
    }

    const response = await fetch(`http://localhost:3001/users/${userId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preferredName, phoneNumber }),
    });
    const data = await response.json();
    console.log(data)
  };

  const hasSubscribedCourses = courseList.length > 0;

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
          
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={"18px"}>
            <Box mb={2}>
              <Typography variant="standard" color="textSecondary">
                Current Name: {user.preferredName}
                Current Phone: {user.phoneNumber}
              </Typography>
            </Box>
            </Box>

          <Box display="flex" alignItems="center" justifyContent="center" padding={"18px"}>
          <Typography variant="standard" color="textSecondary">Your current information:</Typography>
            <Box mr={2}>
              <TextField
                label="Preferred Name"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                error={
                  preferredName.trim().length < 2 ||
                  preferredName.trim().length > 50 ||
                  !/^[A-Za-z]+$/.test(preferredName)
                }
                helperText={
                  preferredName.trim().length < 2 || preferredName.trim().length > 50
                    ? "Preferred name must be between 2 and 50 characters"
                    : !/^[A-Za-z]+$/.test(preferredName)
                      ? "Preferred name can only contain letters"
                      : ""
                }
              />
            </Box>
            <Box mr={2}>
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={!/^\d{10}$/.test(phoneNumber)}
                helperText={!/^\d{10}$/.test(phoneNumber) ? "Phone number must be a 10-digit number" : ""}
              />
            </Box>
            <Button variant="contained" onClick={handleUpdateProfile}>
              Update Profile
            </Button>
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
