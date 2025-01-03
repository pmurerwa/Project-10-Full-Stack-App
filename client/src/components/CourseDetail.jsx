//CourseDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { UserContext } from "../context/UserContext";
import { api } from "../utils/apiHelper";

// CourseDetail displays information about a specific course
const CourseDetail = () => {
  const { authUser } = useContext(UserContext); // Retrieves the authenticated user from UserContext
  const { id } = useParams(); // Retrieve course ID from the URL
  const navigate = useNavigate(); // Hook to redirect between routes

  const [course, setCourse] = useState({
    title: "",
    user: {
      id: null,
      firstName: "",
      lastName: "",
    },
    description: "",
    materialsNeeded: "",
    estimatedTime: "",
  }); // State to hold course data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(""); // State to hold error messages

  // Fetch course details when the component mounts or when the course ID changes
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await api(`/courses/${id}`, "GET");
        if (response.status === 404) {
          navigate("/notfound");
        } else if (response.status === 403) {
          navigate("/forbidden");
        } else {
          const data = await response.json();
          setCourse(data);
          console.log("Fetched course data: ", data); // Add a log to check fetched data
        }
      } catch (error) {
        setError(
          "Failed to fetch data. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  // Handle course deletion
  const handleDeleteCourse = async () => {
    if (window.confirm("Delete this course? (Action cannot be undone)")) {
      try {
        // Send DELETE request to the API to remove the course
        const response = await api(`/courses/${id}`, "DELETE", null, authUser);
        if (response.ok) {
          navigate("/");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Deletion failed");
        }
      } catch (error) {
        setError("Failed to delete the course.");
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
              course.User &&
              authUser.id === course.userId && ( // Ensure the user field is correctly accessed
                <>
                  <Link className="button" to={`/courses/${id}/update`}>
                    Update Course
                  </Link>{" "}
                  {/* Button to navigate to update course page */}
                  <button className="button" onClick={handleDeleteCourse}>
                    Delete Course
                  </button>{" "}
                  {/* Button to delete the course */}
                </>
              )}
            <Link className="button button-secondary" to="/">
              Return to List
            </Link>{" "}
            {/* Button to return to the course list */}
          </div>
        </div>

        {/* Course detail section */}
        <div className="wrap">
          <h2>Course Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              <p>
                By{" "}
                {course.user
                  ? `${course.user.firstName} ${course.user.lastName}`
                  : "Unknown"}
              </p>{" "}
              {/* Display course author name */}
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
