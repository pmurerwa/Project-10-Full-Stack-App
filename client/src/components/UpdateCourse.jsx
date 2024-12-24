// UpdateCourse.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../utils/apiHelper";
import { UserContext } from "../context/UserContext"; // Ensure this imports the context, not just the provider
import ErrorsDisplay from "./ErrorsDisplay";

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);
  const [errors, setErrors] = useState([]);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: ""
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api(`/courses/${id}`, 'GET');
        if (response.status === 200) {
          const data = await response.json();
          if (data.userId !== authUser.id) { // Check ownership
            navigate("/forbidden");
            return;
          }
          setCourse(data); 
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
      } catch (error) {
        navigate("/error");
      }
    };
    fetchCourse();
  }, [authUser, id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      setErrors(["Authentication required. Please sign in and try again."]);
      return;
    } 

    try {
      const response = await api(`/courses/${id}`, "PUT", course, {
        emailAddress: authUser.email,
        password: authUser.password,
      });

      if (response.status === 204) {
        navigate(`/courses/${id}`);
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 404) {
        navigate("/notfound");
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error('Unexpected HTTP status');
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>
        <ErrorsDisplay errors={errors} />
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="title"
                type="text"
                value={course?.title || ''}
                onChange={handleChange}
              />

              <p>By {authUser?.firstName} {authUser?.lastName}</p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="description"
                value={course?.description || ''}
                onChange={handleChange}
              />

            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={course?.estimatedTime || ''}
                onChange={handleChange}
              />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={course?.materialsNeeded || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="button" type="submit">Update Course</button>
          <Link to="/" className="button button-secondary"onClick={handleCancel}>Cancel</Link>
        </form>
      </div>
    </main>
  );
};

export default UpdateCourse;