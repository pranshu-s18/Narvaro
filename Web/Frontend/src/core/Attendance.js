import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceAPI, isAuthenticated } from "../auth/helper";
import Base from "./Base";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const dates = (duration) => {
  const start = moment().startOf(duration);
  const list = [start.toDate()];
  while (start.isBefore(moment().endOf(duration), "date"))
    list.push(start.add(1, "day").toDate());
  return list;
};

const Attendance = () => {
  const { user, token } = isAuthenticated();
  const [attendance, setAttendance] = useState([]);
  const [hostel, setHostel] = useState("BH2");
  const [dateList, setDateList] = useState([]);
  const { rollNo } = useParams();

  useEffect(() => {
    let data = rollNo ? JSON.stringify({ rollNo }) : JSON.stringify({ hostel });
    attendanceAPI(user._id, token, data).then((res) => {
      if (res.error) console.log(res.error);
      else setAttendance(rollNo ? res[0] : res);
    });

    setDateList(dates(rollNo ? "month" : "week"));
  }, []);

  const attRender = (data) => {
    if (data) {
      let ar = new Array(dateList.length).fill(false);
      data.forEach((el) => {
        ar[(rollNo ? moment(el).date() : moment(el).day()) - 1] = moment(el);
      });

      const text = (date, el, i) =>
        i >= date ? "-" : el ? el.format("hh:mm A") : "A";

      return ar.map((el, i) =>
        rollNo ? (
          <tr key={i}>
            <td>{moment(dateList[i]).format("DD MMM")}</td>
            <td>{text(moment().date(), el, i)}</td>
          </tr>
        ) : (
          <td key={i}>{text(moment().day(), el, i)}</td>
        )
      );
    } else
      return rollNo ? (
        <tr>
          <td>Loading...</td>
        </tr>
      ) : (
        <td>Loading...</td>
      );
  };

  const tableHeading = () =>
    rollNo ? (
      <tr>
        <th>{rollNo}</th>
        <th>{attendance.hostel}</th>
      </tr>
    ) : (
      <tr>
        <th>Roll No</th>
        {dateList.map((date, id) => (
          <th key={id}>{moment(date).format("DD MMM")}</th>
        ))}
      </tr>
    );

  return (
    <Base className="py-4">
      <div className="container">
        <table className="table table-responsive text-white text-center">
          <thead>{tableHeading()}</thead>
          <tbody>
            {rollNo
              ? attRender(attendance.attendance)
              : attendance.map((stu, id1) => (
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
