import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceAPI, isAuthenticated } from "../auth/helper";
import Base from "../core/Base";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const dates = () => {
  const start = moment().startOf("month");
  const list = [start.toDate()];
  while (start.isBefore(moment().endOf("month"), "date"))
    list.push(start.add(1, "day").toDate());
  return list;
};

const StudentAttendance = () => {
  const { user, token } = isAuthenticated();
  const [attendance, setAttendance] = useState([]);
  const [dateList, setDateList] = useState([]);
  const { rollNo } = useParams();

  useEffect(() => {
    attendanceAPI(user._id, token, JSON.stringify({ rollNo })).then((data) => {
      if (data.error) console.log(data.error);
      else setAttendance(data[0]);
    });

    setDateList(dates());
  }, []);

  const attRender = () => {
    if (attendance.attendance) {
      let ar = new Array(dateList.length).fill(false);
      attendance.attendance.forEach(
        (el) => (ar[moment(el).date() - 1] = moment(el))
      );

      return ar.map((el, i) => (
        <tr key={i}>
          <td>{moment(dateList[i]).format("DD MMM")}</td>
          <td>
            {i >= moment().date() ? "-" : el ? el.format("hh:mm A") : "A"}
          </td>
        </tr>
      ));
    } else
      return (
        <tr>
          <td>Loading...</td>
        </tr>
      );
  };

  return (
    <Base className="py-4">
      <div className="container">
        <table className="table table-responsive text-white text-center">
          <thead>
            <tr>
              <th>{rollNo}</th>
              <th>{attendance.hostel}</th>
            </tr>
          </thead>
          <tbody>{attRender()}</tbody>
        </table>
      </div>
    </Base>
  );
};

export default StudentAttendance;
