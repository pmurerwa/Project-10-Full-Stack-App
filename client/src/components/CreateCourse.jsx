//CreateCourse.jsx
import { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { api } from '../utils/apiHelper';
import ErrorsDisplay from './ErrorsDisplay'; // Assuming ErrorsDisplay is another component to display error messages

const CreateCourse = () => {
    const { authUser } = useContext(UserContext);// Destructure authUser from the UserContext
    const navigate = useNavigate();// Get the navigate function from useNavigate for programmatic navigation

    // Create references for the form fields
    const titleRef = useRef();
    const descriptionRef = useRef();
    const estimatedTimeRef = useRef();
    const materialsNeededRef = useRef();
    const [errors, setErrors] = useState([]); // State to hold any validation or error messages

    // Redirect to sign-in page if user is not authenticated
    useEffect(() => {
        if (!authUser) {
            setErrors(['Please sign in to create a course']);
            navigate('/sign-in');
        }
    }, [authUser, navigate]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const courseData = { // Gather course data from form inputs
            userId: authUser.id,
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            estimatedTime: estimatedTimeRef.current.value,
            materialsNeeded: materialsNeededRef.current.value
        };

         // Make API call to create course
         try {
            const response = await api("/courses", "POST", courseData, authUser);
            if (response.status === 201) {
                console.log('Course has been created.');
                navigate('/');
            } else if (response.status === 400) {
                const error = await response.json();
                setErrors(error.errors || ["Validation errors occurred."]);
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            } else {
                throw new Error('Unhandled status code');
            }
        } catch (err) {
            console.error('Error creating course:', err);
            setErrors(['Failed to create course. Please try again.']);
        }
    };

     // Handle cancel button action
     const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return ( // Render the form for creating a course
        <div className="wrap">
            <h2>Create Course</h2>
            <ErrorsDisplay errors={errors} />
            <form onSubmit={handleSubmit}>
                <div className="main--flex">
                    <div>
                        <label htmlFor="courseTitle">Course Title</label>
                        <input
                            id="courseTitle"
                            name="courseTitle"
                            type="text"
                            ref={titleRef}
                        />
                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea
                            id="courseDescription"
                            name="courseDescription"
                            ref={descriptionRef}
                        />
                    </div>
                    <div>
                        <label htmlFor="estimatedTime">Estimated Time</label>
                        <input
                            id="estimatedTime"
                            name="estimatedTime"
                            type="text"
                            ref={estimatedTimeRef}
                        />
                        <label htmlFor="materialsNeeded">Materials Needed</label>
                        <textarea
                            id="materialsNeeded"
                            name="materialsNeeded"
                            ref={materialsNeededRef}
                        />
                    </div>
                </div>
                <button className="button" type="submit">Create Course</button>
                <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateCourse;