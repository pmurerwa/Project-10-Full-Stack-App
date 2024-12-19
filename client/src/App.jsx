/**
 * App file that acquires components and sets the routes that are needed for the react web application
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//importing components
import Header from "./components/Header";
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
// import UserSignIn from "./components/UserSignIn";
// import UserSignUp from "./components/UserSignUp";
// import UserSignOut from "./components/UserSignOut";
// import CreateCourse from "./components/CreateCourse";
// import UpdateCourse from "./components/UpdateCourse";
// import NotFound from "./components/NotFound";
// import Forbidden from "./components/Forbidden";
// import UnhandledError from "./components/UnhandledError";
// import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        {/* <Route path="/error" element={<Error />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signout" element={<UserSignOut />} />
        <Route path="/signup" element={<UserSignUp />} /> */}
        {/* Private Routes */}
        {/* <Route element={<PrivateRoute />}>
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/update" element={<UpdateCourse />} />
        </Route> */}
        {/* Anything Else */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

//Exports the app component to the main.jsx to be rendered to the DOM
export default App;
