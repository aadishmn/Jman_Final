import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Questions from '../Data/feedbackQues.json'


function Feedback() {
    const [accessToken, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    // Assume user is not an admin by default
    const location = useLocation();

    const navigate = useNavigate();
    const start_period = sessionStorage.getItem('start_period');
    const  end_period= sessionStorage.getItem('end_period');
    const projectId = sessionStorage.getItem('projectId_timesheet');

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }

        // console.log(decodedPID, decodedStart, decodedEnd)
    }, [location.search]);

    const [formData, setFormData] = useState({
        q1: 1,
        q2: 1,
        q3: 1,
        q4: 1,
        q5: 1,
        q6: 1,
        comments: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/feedback/CreateFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    projectId: projectId,
                    start_period: start_period,
                    end_period: end_period,
                    feedback: formData,
                    role:role
                })
            });
            const res = await response.json()
            console.log("Fggf", res)

            if (res.message != "Feedback data saved") {
                alert('Failed to save data');
            }
            else {
                alert('feedback given succussfully')
            }

            navigate('/feedback');

        } catch (error) {
            console.error('Error submitting feedback:', error.message)
        }

        // try {
        //     const response = await fetch('http://localhost:5000/api/FeedbackHistory', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        //         },
        //         body: JSON.stringify({
        //             projectId: projectId,
        //             start_period: start_period,
        //             end_period: end_period,
        //             feedback_given: true
        //         }),
        //     });

        // } catch (error) {
        //     alert('Error updating feedback history:', error.message)
        //     console.error('Error fetching timesheet data:', error);
        // }

    };

    return (
        <div>
       
        <div className="grid grid-cols-5 mx-auto p-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-md">
           <div className='4 col-span-1'></div>
           <div className='col-span-3 bg-[rgba(255,255,255,0.1)]  p-4 rounded-lg backdrop-blur-xl shadow-xl'>
            <h2 className="text-3xl font-bold mb-6 text-white">Feedback Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">  
                    <label htmlFor="q1" className="block font-bold">{Questions.common.q1}</label>
                    <input type="number" id="q1" name="q1" value={formData.q1} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q2" className="block font-bold">{Questions.common.q2}</label>
                    <input type="number" id="q2" name="q2" value={formData.q2} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q3" className="block font-bold">{Questions.common.q3}</label>
                    <input type="number" id="q3" name="q3" value={formData.q3} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q4" className="block font-bold">{Questions.common.q4}</label>
                    <input type="number" id="q4" name="q4" value={formData.q4} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q5" className="block font-bold">{Questions.common.q5}</label>
                    <input type="number" id="q5" name="q5" value={formData.q5} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q6" className="block font-bold">{Questions[role].q6}</label>
                    <input type="number" id="q6" name="q6" value={formData.q6} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q7" className="block font-bold">{Questions[role].q7}</label>
                    <input type="number" id="q7" name="q7" value={formData.q7} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="q8" className="block font-bold">{Questions[role].q8}</label>
                    <input type="number" id="q8" name="q8" value={formData.q8} onChange={handleInputChange} min="1" max="5" className="form-input" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="comments" className="block font-bold">Comments:</label>
                    <textarea id="comments" name="comments" value={formData.comments} onChange={handleInputChange} className="form-textarea" required />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
            </form>
            </div> 
        </div>
        </div>

    );
}

export default Feedback;