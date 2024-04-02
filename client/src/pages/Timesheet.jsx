import { useState, useEffect } from "react";
import "../styles/Timesheet.css"; // Custom CSS file for additional styling
import "bootstrap/dist/css/bootstrap.min.css";


function TimeSheetParent() {

    const [startDate, setStartDate] = useState(new Date('2024-01-01'));
    const [endDate, setEndDate] = useState(new Date('2024-01-07'));

    console.log("starte", startDate);
    console.log("ende", endDate);

    const handleNextWeek = () => {
        // Increment the start date by 7 days to get the start date of the next week
        const nextStartDate = new Date(startDate);
        nextStartDate.setDate(nextStartDate.getDate() + 7);
        setStartDate(nextStartDate.toISOString());

        const nextEndDate = new Date(endDate);
        nextEndDate.setDate(nextEndDate.getDate() + 7);
        setEndDate(nextEndDate.toISOString());
    };

    const handlePreviousWeek = () => {
        // Increment the start date by 7 days to get the start date of the next week
        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        setStartDate(prevStartDate.toISOString());

        const prevEndDate = new Date(endDate);
        prevEndDate.setDate(prevEndDate.getDate() - 7);
        setEndDate(prevEndDate.toISOString());
    };

    const getWeekDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            dates.push(date.toDateString()); // You can format the date as needed
        }
        return dates;
    };

    const weekdaysval = getWeekDates();
    console.log(weekdaysval)

    
    function TimeSheet(range) {
        const [Timesheetdata, setTimesheetdata] = useState({});
        const [Assignedprojects, SetAssignedprojects] = useState([]);
        const [TotalHours, SetTotalHours] = useState(0);
        const firstID = Object.keys(Timesheetdata)[0];
    
        const [ID, setID] = useState(0);
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/getTimesheetData', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ startPeriod: range.startPeriod, endPeriod: range.endPeriod }),
                    });
    
                    const data = await response.json();
                    console.log(data);
                    setTimesheetdata(data.payload)
                } catch (error) {
                    console.error('Error fetching timesheet data:', error);
                }
            };
    
            const fetchUserProject = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/getUserProject', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
    
                    const data = await response.json();
                    console.log(data);
                    SetAssignedprojects(data.payload)
                } catch (error) {
                    console.error('Error fetching timesheet data:', error);
                }
            };
    
            fetchUserProject();
            fetchData();
        }, []);
    
        const handleSubmit = async (e) => {
            console.log(Timesheetdata);
            try {
                const response = await fetch('http://localhost:5000/api/CreateUpdateTimesheets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(Timesheetdata),
                });
    
                // const data = await response.json();
                // console.log(response);
                // setTimesheetdata(data.payload)
            } catch (error) {
                console.error('Error fetching timesheet data:', error);
            }
        }
    
        function TimeSheetLoop(setID) {
            const [seed, setSeed] = useState(0);
            var totalMon = 0;
            var totalTue = 0;
            var totalWed = 0;
            var totalThur = 0;
            var totalFri = 0;
            var totalSat = 0;
            var totalSun = 0;
    
            for (const key in Timesheetdata) {
                totalMon += Number(Timesheetdata[key]['mon']);
                totalTue += Number(Timesheetdata[key]['tue']);
                totalWed += Number(Timesheetdata[key]['wed']);
                totalThur += Number(Timesheetdata[key]['thur']);
                totalFri += Number(Timesheetdata[key]['fri']);
                totalSat += Number(Timesheetdata[key]['sat']);
                totalSun += Number(Timesheetdata[key]['sun']);
            };
            let GrandTotal = totalMon + totalTue + totalWed + totalThur + totalFri + totalSat + totalSun;
            SetTotalHours(GrandTotal);
            return (
                <>
                    {Object.entries(Timesheetdata).map((t, k) => {
                        if (t[1].visible) {
                            return (
                                <Showtimesheet
                                    id={t[0]}
                                    data={t}
                                    seedSetter={setSeed}
                                    startPeriod={range.startPeriod}
                                    endPeriod={range.endPeriod}
                                    key={k}
                                ></Showtimesheet>
                            );
                        } else {
                            return null; // Render nothing if 'visible' is false
                        }
                    })}
    
                    <tr>
                        <td>Total Hours</td>
                        <td></td>
                        <td></td>
                        {[totalMon, totalTue, totalWed, totalThur, totalFri, totalSat, totalSun].map((total, index) => (
                            <td key={index}>
                                <p className={total > 8 ? 'text-danger' : ''}>{total}</p>
                            </td>
                        ))}
                        <td>{GrandTotal}</td>
                    </tr>
                </>
            )
        };
    
        function Showtimesheet({ id, data, seedSetter, startPeriod, endPeriod }) {
            const ChangeField = (e, field) => {
                e.preventDefault();
                const currId = e.target.id;
                const currVal = e.target.value;
                Timesheetdata[currId][field] = currVal;
                seedSetter(Math.random());
            };
    
            const CreateNewEntry = (e) => {
                e.preventDefault();
                const characters = '0123456789';
                let randomString = '';
                for (let i = 0; i < 6; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    randomString += characters[randomIndex];
                }
    
                const ids = randomString;
                setID(ids);
    
                Timesheetdata[ids] = {
                    UID: ids,
                    email: localStorage.getItem("email"),
                    PID: "",
                    activity: "",
                    comments: "",
                    start_period: startPeriod,
                    end_period: endPeriod,
                    mon: 0,
                    tue: 0,
                    wed: 0,
                    thur: 0,
                    fri: 0,
                    sat: 0,
                    sun: 0,
                    visible: true,
                    created_at: new Date()
                };
                seedSetter(Math.random());
            };
    
            const DeleteEntry = (e) => {
                e.preventDefault();
                const currId = e.target.id;
                Timesheetdata[currId].visible = false;
                seedSetter(Math.random());
            };
    
            const total = Number(data[1].mon) + Number(data[1].tue) + Number(data[1].wed) + Number(data[1].thur) + Number(data[1].fri) + Number(data[1].sat) + Number(data[1].sun);
            return (
                <tr>
                    <td>
                        <select
                            value={data[1].activity}
                            id={id}
                            onChange={(e) => ChangeField(e, 'activity')}
                            className="form-select"
                        >
                            <option value="">Select Project Type</option>
                            <option value="client_project">Client Project</option>
                            <option value="sales_activity">Sales activity</option>
                            <option value="bau">BAU activity</option>
                        </select>
                    </td>
                    <td>
                        <select
                            value={data[1].PID}
                            id={id}
                            onChange={(e) => ChangeField(e, 'PID')}
                            className="form-select"
                        >
                            <option value="">Select Project</option>
                            {Assignedprojects.map((Assignedproject, index) => (
                                <option value={Assignedproject.PID} key={index}>{Assignedproject.name}</option>
                            ))}
                        </select>
                    </td>
                    <td><textarea value={data[1].comments} id={id} onChange={(e) => ChangeField(e, 'comments')} rows="2" cols="30" className="form-control" /></td>
                    {['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'].map((day, index) => (
                        <td key={index}>
                            <input
                                type="text"
                                value={data[1][day]}
                                id={id}
                                onChange={(e) => ChangeField(e, day)}
                                className="form-control"
                            />
                        </td>
                    ))}
                    <td><p>{total}</p></td>
                    <td><button onClick={CreateNewEntry} className="plusbtn">+</button></td>
                    {id !== firstID && <td><button id={id} onClick={DeleteEntry} className="minusbtn">-</button></td>}
                </tr>
            );
        }
    
        return (
            <div className='main'>
                <h3>Total Time: {TotalHours}</h3>
                <p className='subHeading'>Allocation Extension</p>
                <p className='subHeading2'>TimeSheet</p>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th>Project Type</th>
                            <th>Project Name</th>
                            <th>Task Name</th>
                            {[...Array(7)].map((_, index) => {
                                const day = new Date(range.startPeriod);
                                day.setDate(day.getDate() + index);
                                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                                return <th key={index}>{day.toLocaleDateString('en-US', options)}</th>;
                            })}
                            <th>Total</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <TimeSheetLoop setID={setID} />
                    </tbody>
                </table>
                <div>
                    <button onClick={handleSubmit} className="btn btn-primary" label="Submit">Submit</button>
                </div>
            </div>
        );
    }
    
    

    return (
        <div className="container">
            <h1>TimeSheet</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="date-navigation">
                        <button onClick={handlePreviousWeek} className="btn btn-primary">&lt;</button>
                        <span>{weekdaysval[0]} - {weekdaysval[6]}</span>
                        <button onClick={handleNextWeek} className="btn btn-primary">&gt;</button>
                    </div>
                </div>
                {/* <div className="col-md-6 text-right">
                    <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                </div> */}
            </div>
            <div className="row">
                <div className="col-md-12">
                    <TimeSheet startPeriod={startDate} endPeriod={endDate} />
                </div>
            </div>
        </div>
    );
}

export default TimeSheetParent;