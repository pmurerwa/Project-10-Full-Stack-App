import React, { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 
import { api } from '../utils/apiHelper'; 

const CreateCourse = () => {
    const { authUser } = useContext(UserContext);
    const navigate = useNavigate();

    const titleRef = useRef();
    const descriptionRef = useRef();
    const estimatedTimeRef = useRef();
    const materialsNeededRef = useRef();
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (!authUser) {
            setErrors(['Please sign in to create a course']);
            navigate('/sign-in');
        }
    }, [authUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const courseData = {
            userId: authUser.id,
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            estimatedTime: estimatedTimeRef.current.value,
            materialsNeeded: materialsNeededRef.current.value
        };
        try {
            const response = await api("/courses", "POST", courseData, authUser);
            if (response.status === 201) {
                console.log(`Course has been created.`);
                navigate(`/`);

            } else if (response.status === 400) {
                const error = await response.json();
                setErrors(error.errors || ["Validation errors occurred."]);
            } else if (response.status === 500) {
                throw new Error("Server error occurred");
            } else {
                throw new Error("Unhandled status code");
            }
        } catch (err) {
            console.error('Error creating course:', err);
            setErrors(['Failed to create course. Please try again.']);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
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
                        ref={courseTitle}
                        />

                            {/* <p>By {authUser.firstName} {authUser.lastName}</p> */}

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea 
                            id="courseDescription" 
                            name="courseDescription"
                            ref={courseDescription}
                            >

                            </textarea>
                    </div>
                    <div>
                        <label htmlFor="estimatedTime">Estimated Time</label>
                        <input id="estimatedTime" name="estimatedTime" 
                        type="text" 
                        ref={estimatedTime} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded"
                            ref={materialsNeeded}></textarea>
                    </div>
                </div>
                <button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateCourse;