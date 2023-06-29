import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "state";
import CourseWidget from "./CourseWidget";
import { IconButton, Box, Typography, Button, TextField } from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const CoursesWidget = ({ userId, isProfile = false, searchText}) => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);
  const token = useSelector((state) => state.token);
  const pageSize = 5; // Number of courses per page

  const [page, setPage] = useState(1); // Current page
  const [inputPage, setInputPage] = useState(page.toString()); // Input page number

  const getCourses = async () => {
    const response = await fetch("http://localhost:3001/courses/show", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    dispatch(setCourses({ courses: data }));
  };

  const getUserCourses = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/subscriptions`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    dispatch(setCourses({ courses: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserCourses();
    } else {
      getCourses();
    }
    // eslint-disable-next-line
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchRegex = new RegExp(searchText, "i");
    const designationMatch = searchRegex.test(course.courseDesignation);
    const titleMatch = searchRegex.test(course.title);
    return designationMatch || titleMatch;
  });

  const totalPages = Math.ceil(filteredCourses.length / pageSize);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const visibleCourses = filteredCourses.slice(startIndex, endIndex);

  return (
    <>
      {visibleCourses.map(
        ({
          _id,
          title,
          credits,
          termCode,
          subjectCode,
          courseID,
          courseDesignation,
          subscribed,
          description,
        }) => (
          <CourseWidget
            key={_id}
            courseId={_id}
            title={title}
            credits={credits}
            termCode={termCode}
            subjectCode={subjectCode}
            courseID={courseID}
            courseDesignation={courseDesignation}
            subscribed={subscribed}
            description={description}
          />
        )
      )}
      {/* Pagination buttons */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton onClick={handlePrevPage} disabled={page === 1}>
            <NavigateBeforeIcon sx={{ fontSize: "50px" }} 
            />
          </IconButton>

          <Typography fontWeight="bold" fontSize="18px">
            {page} out of {totalPages}
          </Typography>

          <IconButton onClick={handleNextPage} disabled={page === totalPages}>
            <NavigateNextIcon sx={{ fontSize: "50px" }} />
          </IconButton>
    </Box>
      )}
{/* GoTo Buttons */}
{totalPages > 1 && (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    width="fit-content"
    margin="auto"
    textAlign="center"
  >
    <Typography fontWeight="bold" fontSize="15px">
      Go to Page:
    </Typography>

    <Box flex="1" marginX={1}>
      <TextField
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        type="number"
        inputProps={{ min: 1, max: totalPages, step: 1 }}
        variant="outlined"
        margin="normal"
        fullWidth
        sx={{
            "& .MuiInputBase-input": {
              fontSize: "14px", 
              padding: "10px 10px", 
            },
          }}      
          />
    </Box>

    <Button variant="contained" onClick={handleGoToPage}
      sx={{
        fontSize: "12px", 
        padding: "2px 4px", 
      }}
    >
      Go
    </Button>
  </Box>
)}
    </>
  );
};

export default CoursesWidget;
