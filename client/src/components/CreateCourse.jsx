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
            const response = await api("/courses", "POST", courseData);
            const status = response.status;
            if (status === 201) {
                const newCourse = await response.json();
                console.log(`Course has been created.`);
                navigate(`/courses/${newCourse.id}`);
            } else if (status === 400) {
                const error = await response.json();
                setErrors(error.errors || ["Validation errors occurred."]);
            } else if (status === 500) {
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
        <div>
            <h1>Create Course</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Course Title</label>
                <input id="title" ref={titleRef} type="text" />
                <label htmlFor="description">Course Description</label>
                <textarea id="description" ref={descriptionRef} />
                <label htmlFor="estimatedTime">Estimated Time</label>
                <input id="estimatedTime" ref={estimatedTimeRef} type="text" />
                <label htmlFor="materialsNeeded">Materials Needed</label>
                <textarea id="materialsNeeded" ref={materialsNeededRef} />
                <button type="submit">Create Course</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
            {errors.length > 0 && (
                <div>
                    <h2>Errors:</h2>
                    <ul>
                        {errors.map((error, index) => <li key={index}>{error}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CreateCourse;