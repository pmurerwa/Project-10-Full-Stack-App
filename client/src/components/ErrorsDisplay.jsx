// Component to display validation errors
const ErrorsDisplay = ({ errors }) => { // Function component that receives `errors` as props
  let errorsDisplay = null;

   // If there are errors, we create the structure to display them
  if (errors.length) {
    errorsDisplay = (
      <div>
        
        <div className="validation--errors">
        <h3>Validation errors</h3>
          <ul>
            {errors.map((error, i) => (// Each error is displayed as a list item with a unique key
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return errorsDisplay; // Return the errors display (null if no errors)
};

export default ErrorsDisplay;