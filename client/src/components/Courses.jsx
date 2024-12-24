import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";

const Courses = () => {
  // State to hold the list of courses and loading state
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect hook to fetch the list of courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api("/courses", "GET");
        if (response.status === 500) {
          navigate("/error");
        }
        const data = await response.json();
        setCourses(data);

      } catch (error) {
        console.error(`Error fetching courses:, ${error}`);
        navigate("/error");
      } 
      finally {
      setLoading(false);
    }
    };

    fetchCourses();
  }, [navigate]);

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
