import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceAPI, isAuthenticated } from "../auth/helper";
import Base from "./Base";
import { attCell, dates, TableBody, TableHead } from "./Commons";
import "../css/table.css";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const Attendance = () => {
  const { user, token } = isAuthenticated();
  const [attendance, setAttendance] = useState([]);
  const [dateList, setDateList] = useState([]);
  const { hostel } = useParams();

  useEffect(() => {
    setDateList(dates("week"));
  }, []);

  useEffect(() => {
    attendanceAPI(user._id, token, JSON.stringify({ hostel })).then((res) => {
      if (res.error) {
        console.log(res.error);
        setAttendance([]);
      } else setAttendance(res);
    });
  }, [hostel]);

  const attRender = () => {
    if (attendance) {
      let ar = new Array(7).fill(false);
      attendance.forEach((el) => (ar[moment(el).day() - 1] = moment(el)));

      return ar.map((el, i) => attCell("week", el, i));
    } else
      return (
        <td colSpan={7} className="text-center text-info">
          Loading...
        </td>
      );
  };

  return (
    <Base className="py-5">
      <div className="container">
        <div className="custom-table">
          <TableHead>
            <th className="ps-4 w-18">Roll No</th>
            {dateList.map((date, id) => (
              <th key={id} className="w-12">
                {moment(date).format("DD MMM")}
              </th>
            ))}
          </TableHead>

          <TableBody>
            {attendance.map((att, id) => (
              <tr key={id}>
                <td className="ps-4 w-18 text-warning">{att.rollNo}</td>
                {attRender()}
              </tr>
            ))}
          </TableBody>
        </div>
      </div>
    </Base>
  );
};

export default Attendance;
