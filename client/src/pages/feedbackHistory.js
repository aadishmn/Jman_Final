import React, { useState, useEffect } from "react";
import axios from "axios";
import feedbackQuestions from "../Data/feedbackQues.json";
import "../styles/feedbackHistory.css";

function FeedbackHistory() {
  const [userFeedbackData, setUserFeedbackData] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("id");

    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/feedbackHistory/${id}`
        );
        setUserFeedbackData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    }

    if (id) {
      fetchUserData();
    }
  }, []);

  return (
    <div className="feedback-history-page">
      <div className="feedback-history-container">
        <h2>Feedback History</h2>
        {userFeedbackData.map((feedback, index) => (
          <div className="feedback-item" key={index}>
            <p>Role: {feedback.role}</p>
            <p>Email: {feedback.email}</p>
            <p>Start Period: {feedback.start_period}</p>
            <p>End Period: {feedback.end_period}</p>
            {Object.keys(feedbackQuestions[feedback.role]).map(
              (questionKey) => (
                <div key={questionKey}>
                  <p className="feedback-question">
                    {feedbackQuestions[feedback.role][questionKey]}
                  </p>
                  <p className="feedback-value">
                    Value: {feedback[questionKey]}
                  </p>
                </div>
              )
            )}
            <p>Comments: {feedback.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackHistory;
