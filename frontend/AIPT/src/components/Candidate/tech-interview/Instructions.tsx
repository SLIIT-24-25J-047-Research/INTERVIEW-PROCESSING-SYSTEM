import React from "react";

const Instructions: React.FC = () => {
  return (
    <>
      <style>
        {`
.instruction-container {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  min-width: 300px; /* Ensure the container is not too narrow */
  background-color: transparent; /* Removed background color */
}

/* Title of the instructions */
.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}

/* Ordered list styling */
.instruction-list {
  list-style-type: none; /* Removes the numbers */
  padding-left: 0;
}

/* Styling for each list item */
.instruction-item {
  font-size: 1rem;
  margin-bottom: 10px;
  line-height: 1.6;
}

/* Add hover effect on list items */
.instruction-item:hover {
  cursor: pointer;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem; /* Make title smaller on mobile */
  }

  .instruction-item {
    font-size: 1rem; /* Make instruction text smaller on mobile */
  }
}
        `}
      </style>
      <div>
        <div className="instruction-container">
          <h2 className="title">Instructions</h2>
          <ol className="instruction-list">
            <li className="instruction-item">Step 1: Start Test.</li>
            <li className="instruction-item">Step 2: Allow Camera permission.</li>
            <li className="instruction-item">Step 3: Answer Questions.</li>
            <li className="instruction-item">Step 4: End Test.</li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Instructions;
