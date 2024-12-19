import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Courses = () => {
  // State to hold the list of courses and loading state
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // to Indicate New loading state

  // useEffect hook to fetch the list of courses
  useEffect(() => {
    const fetchCourses = async () => {
      // Fetch the list of courses from the API
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        //const data = await response.json();
        console.log("Courses Data: ", response.data); // Log the data
        setCourses(response.data);
      } catch (error) {
        //console.error("Error fetching courses:", error);
        // Log detailed error information to diagnose issues
        console.error("Error fetching courses:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); // Set loading to false after the course is fetched
      }
    };

    fetchCourses();
  }, []);

  // Render loading indicator or courses
  if (loading) {
    return <div>Loading courses...</div>; // Loading message
  }

  return (
    <main>
      <div className="wrap main--grid">
        {courses.map((course) => (
          <Link
            key={course.id}
            className="course--module course--link"
            to={`courses/${course.id}`}
          >
            <h2 className="course--label">Course</h2>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        ))}

        <Link
          className="course--module course--add--module"
          to="/courses/create"
        >
          <span className="course--add--title">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 13 13"
              className="add"
            >
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>
            New Course
          </span>
        </Link>
      </div>
    </main>
  );
};
// Exports the component to App.jsx
export default Courses;
