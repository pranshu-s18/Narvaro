import React, { useEffect, useState } from "react";
import { attendanceAPI, isAuthenticated } from "../auth/helper";
import Base from "./Base";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const dates = () => {
  const start = moment().startOf("week");
  const list = [start.toDate()];
  for (let i = 0; i < 6; i++) list.push(start.add(1, "day").toDate());
  return list;
};

const Attendance = () => {
  const { user, token } = isAuthenticated();
  const [attendance, setAttendance] = useState([]);
  const [hostel, setHostel] = useState("BH2");
  const [dateList, setDateList] = useState([]);

  useEffect(() => {
    attendanceAPI({ id: user._id, token, hostel }).then((data) => {
      if (data.error) console.log(data.error);
      else setAttendance(data);
    });

    setDateList(dates());
  }, []);

  const attRender = (data) => {
    let ar = [false, false, false, false, false, false, false];
    data.forEach((el) => (ar[moment(el).day() - 1] = moment(el)));

    return ar.map((el, i) => {
      if (i >= moment().day()) return <td key={i}>-</td>;
      else {
        if (el) return <td key={i}>{el.format("hh:mm A")}</td>;
        else return <td key={i}>A</td>;
      }
    });
  };

  return (
    <Base className="py-4">
      <div className="container">
        <table className="table table-responsive text-white text-center">
          <thead>
            <tr>
              {console.log(attendance)}
              <th>Roll No</th>
              {dateList.map((date, id) => (
                <th key={id}>{moment(date).format("DD MMM")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendance.map((stu, id1) => (
              <tr key={id1}>
                <td>{stu.rollNo}</td>
                {attRender(stu.attendance)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Base>
  );
};

export default Attendance;
