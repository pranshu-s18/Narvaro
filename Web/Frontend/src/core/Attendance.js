import moment from "moment";
import React, { useEffect, useState } from "react";
import { attendanceAPI, isAuthenticated } from "../auth/helper";
import Base from "./Base";

const Section = (data) => (
  <table className="table table-responsive text-white text-center">
    <thead>
      <tr>
        <th>Roll No.</th>
        <th>Attendance</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {data.map((record, id) => (
        <tr key={id} className="spaced-table">
          <td>{record.rollNo}</td>
          <td>{record.present ? "P" : "A"}</td>
          <td>{moment(record.date)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const SubSection = (data, id) => (
  <tbody key={id}>
    {data.map((att, id2) => (
      <tr key={id2} className="spaced-table">
        <td>{att.rollNo}</td>
        <td>{att.present ? "Present" : "Absent"}</td>
        <td>{moment(att.date).format("hh:mm A")}</td>
      </tr>
    ))}
  </tbody>
);

const Attendance = () => {
  const { user, token } = isAuthenticated();
  const [dataStore, setDataStore] = useState();
  const [attendance, setAttendance] = useState([]);
  const [hostel, setHostel] = useState("BH2");

  useEffect(() => {
    attendanceAPI({ id: user._id, token, hostel }).then((data) => {
      if (data.error) console.log(data.error);
      else {
        setDataStore(data);
        data.forEach((el) =>
          el.attendance = el.attendance.filter((e) =>
            moment(e.date).isBetween(moment().subtract(1, "day"), moment())
          )
        );
        setAttendance(data);
      }
    });
  }, []);

  return <Base className="py-4"></Base>;
};

export default Attendance;
