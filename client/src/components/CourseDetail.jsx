import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { UserContext } from "../context/UserContext";

//CourseDetail displays information about a specific course
const CourseDetail = () => {
  const { authUser } = useContext(UserContext); // Retrieves the authenticated user from UserContext
  const { id } = useParams(); // Retrieve course ID from the URL
  const navigate = useNavigate(); // Hook to redirect between routes

  // State variables for course data, loading status, and error handling
  const [course, setCourse] = useState(null); // State to hold course data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to hold error messages

  // Fetch course details when the component mounts or when the course ID changes
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${id}`
        );
        const courseData = response.data;
        console.log(courseData); // For debugging, loads the response
        setCourse(courseData); // Sets course data and loading state
      } catch {
        setError("Course not found"); //Logs Error message when the course is not found
      } finally {
        setLoading(false); //Removes loading after fetching data
      }
    };

    if (id) {
      fetchCourseData(); // Fetch course data only if the ID is valid
    } else {
      setLoading(false); // If there's no ID, stop loading
      setError("Invalid course ID"); // Set error message for invalid course ID
    }
  }, [id, authUser, navigate]); // Include authUser and navigate in the dependency array


  // Handle course deletion
  const handleDeleteCourse = async () => {
    // Confirm deletion from the user
    if (window.confirm("Delete this course? (Action cannot be undone)")) {
      try {
        // Send DELETE request to the API to remove the course
        await axios.delete(`http://localhost:5000/api/courses/${id}`, {
          headers: {
            Authorization: `Basic ${authUser.authToken}`, // Include authorization token for authentication
          },
        });
        navigate("/"); // Navigate back to the course list after deletion
      } catch {
        setError("Failed to delete course"); // Set error message if deletion fails
      }
    }
  };

  // Handles loading and error states
  if (loading) return <p>Loading...</p>; // Display loading message while fetching data
  if (error) return <p>{error}</p>; // Display error message if there's an error


  return (
    <>
    <main>
        {/* Action buttons for updating and deleting course */}
        <div className="actions--bar">
          <div className="wrap">
            {authUser &&
              authUser.id === course.user.id && ( // Check if the authenticated user is the course owner
                <>
                  <Link className="button" to={`/courses/${id}/update`}>
                    Update Course{" "}
                    {/* Button to navigate to update course page */}
                  </Link>
                  <button className="button" onClick={handleDeleteCourse}>
                    Delete Course {/* Button to delete the course */}
                  </button>
                </>
              )}
            <Link className="button button-secondary" to="/">
              Return to List {/* Button to return to the course list */}
            </Link>
          </div>
        </div>

        {/* Course detail section */}
        <div className="wrap">
          <h2>Course Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>{" "}
              {/* Display course title */}
              <p>
                By{" "}
                {course.user
                  ? `${course.user.firstName} ${course.user.lastName}` // Display course author name
                  : "Unknown"}
              </p>
              <ReactMarkdown>{course.description}</ReactMarkdown>{" "}
              {/* Render course description using ReactMarkdown */}
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{course.estimatedTime}</p>{" "}
              {/* Display estimated time for the course */}
              <h3 className="course--detail--title">Materials Needed</h3>
              <ul className="course--detail--list">
                <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>{" "}
                {/* Render materials needed using ReactMarkdown */}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>  
  );
};

export default CourseDetail;
