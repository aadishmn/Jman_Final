import { useState, useEffect } from "react";
import "../styles/Timesheet.css"; // Custom CSS file for additional styling
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function TimeSheetParent() {
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-01-07"));

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

  function TimeSheet(range) {
    const [Timesheetdata, setTimesheetdata] = useState({});
    const [Assignedprojects, SetAssignedprojects] = useState([]);
    const [TotalHours, SetTotalHours] = useState(0);
    const firstID = Object.keys(Timesheetdata)[0];
    const [userProjects, setUserProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [projectDetails, setProjectDetails] = useState(null); // State to hold project details
    const [checkFlag, setCheckFlag] = useState(false);

    const navigate = useNavigate();

    const [ID, setID] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/getTimesheetData",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                startPeriod: range.startPeriod,
                endPeriod: range.endPeriod,
              }),
            }
          );

          const data = await response.json();
          setTimesheetdata(data.payload);
          const [temp] = Object.keys(data.payload);
          // const payloadArray = data.payload[temp];
          if (data.payload[temp].flag === true) navigate("/feedback");

          console.log(temp);
          setCheckFlag(data.payload[temp].flag);
          // console.log(payloadArray.flag)
          console.log(checkFlag);
        } catch (error) {
          console.error("Error fetching timesheet data:", error);
        }
      };

      const fetchUserProject = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/getUserProject",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const data = await response.json();
          console.log(data.payload);
          SetAssignedprojects(data.payload);
        } catch (error) {
          console.error("Error fetching timesheet data:", error);
        }
      };

      fetchUserProject();
      fetchData();
    }, []);

    // useEffect(() => {
    //         // Recalculate total hours whenever Timesheetdata changes
    //         let totalHours = 0;
    //         for (const key in Timesheetdata) {
    //             const row = Timesheetdata[key];
    //             totalHours += Number(row.mon) + Number(row.tue) + Number(row.wed) + Number(row.thur) + Number(row.fri) + Number(row.sat) + Number(row.sun);
    //         }
    //         SetTotalHours(totalHours);
    //     }, []);

    const handleSubmit = async (e) => {
      try {
        const [id] = Object.keys(Timesheetdata);
        const payload = Timesheetdata;
        payload[id].flag = true;
        const response = await fetch(
          "http://localhost:5000/api/CreateUpdateTimesheets",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(Timesheetdata),
          }
        );

        const start_period = Timesheetdata[id].start_period;
        const end_period = Timesheetdata[id].end_period;
        const projectId = Timesheetdata[id].projectId;
        sessionStorage.setItem("start_period", start_period);
        sessionStorage.setItem("end_period", end_period);
        sessionStorage.setItem("projectId_timesheet", projectId);
        navigate("/feedback");
        // const data = await response.json();
        // console.log(response);
        // setTimesheetdata(data.payload)
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      }
    };

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
        if (Timesheetdata[key]["visible"]) {
          totalMon += Number(Timesheetdata[key]["mon"]);
          totalTue += Number(Timesheetdata[key]["tue"]);
          totalWed += Number(Timesheetdata[key]["wed"]);
          totalThur += Number(Timesheetdata[key]["thur"]);
          totalFri += Number(Timesheetdata[key]["fri"]);
          totalSat += Number(Timesheetdata[key]["sat"]);
          totalSun += Number(Timesheetdata[key]["sun"]);
        }
      }
      let GrandTotal =
        totalMon +
        totalTue +
        totalWed +
        totalThur +
        totalFri +
        totalSat +
        totalSun;
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
            {[
              totalMon,
              totalTue,
              totalWed,
              totalThur,
              totalFri,
              totalSat,
              totalSun,
            ].map((total, index) => (
              <td key={index}>
                <p className={total > 8 ? "text-danger" : ""}>{total}</p>
              </td>
            ))}
            <td>{GrandTotal}</td>
          </tr>
        </>
      );
    }

    function Showtimesheet({ id, data, seedSetter, startPeriod, endPeriod }) {
      const ChangeMon = (e) => {
        e.preventDefault();
        var currId = e.target.id;

        var currVal = e.target.value;

        Timesheetdata[currId]["mon"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeTue = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["tue"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeWed = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["wed"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeThur = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["thur"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeFri = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["fri"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeSat = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["sat"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeSun = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["sun"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeName = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["PID"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeComment = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["comments"] = currVal;
        seedSetter(Math.random());
      };

      const ChangeActivity = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        var currVal = e.target.value;
        Timesheetdata[currId]["activity"] = currVal;
        seedSetter(Math.random());
      };

      const CreateNewEntry = (e) => {
        const characters = "0123456789";
        let randomString = "";
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters[randomIndex];
        }

        const ids = randomString;
        setID(ids);

        Timesheetdata[ids] = {
          UID: ids,
          email: sessionStorage.getItem("email"),
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
          submitted: false,
          created_at: new Date(),
        };
        seedSetter(Math.random());
      };

      const DeleteEntry = (e) => {
        e.preventDefault();
        var currId = e.target.id;
        Timesheetdata[currId].visible = false;
        Timesheetdata[currId].submitted = false;
        seedSetter(Math.random());
      };

      var total =
        Number(data[1].mon) +
        Number(data[1].tue) +
        Number(data[1].wed) +
        Number(data[1].thur) +
        Number(data[1].fri) +
        Number(data[1].sat) +
        Number(data[1].sun);
      return (
        <tr>
          <td>
            <select
              value={data[1].activity}
              id={id}
              onChange={ChangeActivity}
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
              onChange={ChangeName}
              className="form-select"
            >
              <option value="">Select Project</option>
              {Assignedprojects.map((Assignedproject, index) => (
                <option value={Assignedproject.PID} key={index}>
                  {Assignedproject.name}
                </option>
              ))}
            </select>
          </td>
          <td>
            <textarea
              value={data[1].comments}
              id={id}
              onChange={ChangeComment}
              rows="2"
              className="form-control"
              style={{ width: "100%", minHeight: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].mon}
              id={id}
              onChange={ChangeMon}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].tue}
              id={id}
              onChange={ChangeTue}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].wed}
              id={id}
              onChange={ChangeWed}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].thur}
              id={id}
              onChange={ChangeThur}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].fri}
              id={id}
              onChange={ChangeFri}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].sat}
              id={id}
              onChange={ChangeSat}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={data[1].sun}
              id={id}
              onChange={ChangeSun}
              style={{ width: "50px" }}
            />
          </td>
          <td>
            <p>{total}</p>
          </td>
          <td>
            <button onClick={CreateNewEntry} className="plusbtn">
              +
            </button>
          </td>
          {id !== firstID && (
            <td>
              <button id={id} onClick={DeleteEntry} className="minusbtn">
                -
              </button>
            </td>
          )}
        </tr>
      );
    }

    // const fetchProjectDetails = async (projectId) => {
    //     try {
    //         const response = await fetch(`backend_url/projects/${projectId}`); // Adjust the URL according to your backend route
    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.error('Error fetching project details:', error);
    //         return null;
    //     }
    // };

    const handleProjectChange = (event) => {
      const projectId = event.target.value;
      setSelectedProject(event.target.value);
      // const details = await fetchProjectDetails(projectId);
      // setProjectDetails(details);
    };
    return (
      <div className="main">
        <h3 className="total-time">Total Time: {TotalHours}</h3>
        <div className="section-heading">
          <p className="subHeading">
            Allocation Extension
            <select
              value={selectedProject}
              onChange={handleProjectChange}
              className="form-select"
              style={{ color: "purple", backgroundColor: "white" }}
            >
              <option value="">Select Project</option>
              {Assignedprojects.map((Assignedproject, index) => (
                <option value={Assignedproject.PID} key={index}>
                  {Assignedproject.name}
                </option>
              ))}
            </select>
          </p>
          <div className="subHeading2">
            {Assignedprojects && (
              <div>
                {Assignedprojects.map((Assignedproject, index) => {
                  if (Assignedproject.PID === selectedProject) {
                    return (
                      <div key={index}>
                        <p>
                          Project Start Date:{" "}
                          {new Date(Assignedproject.start).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </p>
                        <p>
                          Project End Date:{" "}
                          {new Date(Assignedproject.end).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Project Type</th>
              <th>Project Name</th>
              <th>Task Name</th>
              {[...Array(7)].map((_, index) => {
                const day = new Date(range.startPeriod);
                day.setDate(day.getDate() + index);
                const options = {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                };
                return (
                  <th key={index}>
                    {day.toLocaleDateString("en-US", options)}
                  </th>
                );
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
        <div className="submit-button">
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <h1 className="timesheet-title">TimeSheet</h1>
      <div className="date-navigation">
        <button
          onClick={handlePreviousWeek}
          className="btn btn-purple date-navigation-btn"
        >
          &lt;
        </button>
        <p className="date-range">
          {weekdaysval[0]} - {weekdaysval[6]}
        </p>
        <button
          onClick={handleNextWeek}
          className="btn btn-purple date-navigation-btn"
        >
          &gt;
        </button>
      </div>
      <div className="timesheet">
        <TimeSheet startPeriod={startDate} endPeriod={endDate} />
      </div>
    </div>
  );
}

export default TimeSheetParent;
