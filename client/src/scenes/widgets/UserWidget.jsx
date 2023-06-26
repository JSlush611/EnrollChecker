import {
    ManageAccountsOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
  import { Box, Typography, Divider, useTheme } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

  
  const UserWidget = ({ userId }) => {
    const courseList = useSelector((state) => state.courseList);
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
  
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      
    };
  
    useEffect(() => {
      getUser();
      // eslint-disable-next-line
    }, []);
  
    if (!user) {
      return null;
    }
  
    const {
    preferredName,
    } = user;
  
    return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <FlexBetween gap="1rem">
            <Box>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {preferredName}
              </Typography>
              <Typography color={medium}>{courseList.length} courses subscribed.</Typography>
            </Box>
          </FlexBetween>
          <ManageAccountsOutlined />
        </FlexBetween>
  
        <Divider />

        {/* SECOND ROW */}
        <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>Your subscribed courses:</Typography>
        </Box>
        {courseList.map((course) => (
          <Typography key={course._id} color={medium}>
            {course.title}
    </Typography>
  ))}
      </Box>
      <Divider />
      </WidgetWrapper>
    );
  };
  
  export default UserWidget;