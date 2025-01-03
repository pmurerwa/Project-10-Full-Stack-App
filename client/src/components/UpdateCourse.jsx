// UpdateCourse.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../utils/apiHelper";
import { UserContext } from "../context/UserContext"; // Ensure this imports the context, not just the provider
import ErrorsDisplay from "./ErrorsDisplay";

// Component for updating course details
const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);
  const [errors, setErrors] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api(`/courses/${id}`, "GET");

        if (response.status === 200) {
          const data = await response.json();
          // Check if authUser is the owner of the course
          if (authUser.id != data.userId) {
            navigate("/forbidden");
          } else {
            // Set course details to state
            setTitle(data.title);
            setDescription(data.description);
            setMaterialsNeeded(data.materialsNeeded);
            setEstimatedTime(data.estimatedTime);
          }
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
      } catch {
        navigate("/error");
      }
    };
    fetchCourse();
  }, [authUser.id, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentCourse = {
        title,
        description,
        estimatedTime,
        materialsNeeded
    };

    // Auth check before making API request
    if (!authUser) {
      setErrors(["Authentication required. Please sign in and try again."]);
      return;
    }

    // Try updating the course with the provided details
    try {
      const response = await api(`/courses/${id}`, "PUT", currentCourse, authUser);

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
        throw new Error("Unexpected HTTP status");
      }
    } catch {
      navigate("/error");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(`/courses/${id}`); // Navigate back to the course detail page
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
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />

              <p>
                By {authUser?.firstName} {authUser?.lastName}
              </p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="description"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={estimatedTime || ""}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={materialsNeeded || ""}
                onChange={(e) => setMaterialsNeeded(e.target.value)}
              />
            </div>
          </div>
          <button className="button" type="submit">
            Update Course
          </button>
          <Link
            to="/"
            className="button button-secondary"
            onClick={handleCancel}
          >
            Cancel
          </Link>
        </form>
      </div>
    </main>
  );
};

export default UpdateCourse;
