import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { attendanceAPI, isAuthenticated } from "../auth/helper";
import Base from "./Base";
import { attCell, dates, TableBody, TableHead } from "./Commons";
import "../css/table.css";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const StudentAttendance = () => {
  const { user, token } = isAuthenticated();
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(moment());
  const [dateList, setDateList] = useState([]);
  const { rollNo } = useParams();

  useEffect(() => {
    const data = {
      rollNo: rollNo,
      startDate: date.startOf("month").toDate(),
      endDate: date.endOf("month").toDate(),
    };

    attendanceAPI(user._id, token, JSON.stringify(data)).then((res) => {
      if (res.error) console.log(res.error);
      else setAttendance(res[0]);
    });

    setDateList(dates("month", date));
  }, [date]);

  const attRender = (data) => {
    if (data) {
      let ar = new Array(dateList.length).fill(false);
      data.forEach((el) => (ar[moment(el).date() - 1] = moment(el)));

      const day = (date, i) => (
        <>
          <td className="w-25">{moment(dateList[i]).format("DD MMM")}</td>
          {attCell("month", date, i)}
        </>
      );

      return ar
        .reduce((accumulator, _, i) => {
          if (i % 2 === 0) accumulator.push(ar.slice(i, i + 2));
          return accumulator;
        }, [])
        .map((el, id) => {
          return (
            <tr key={id}>
              {day(el[0], id * 2)}
              {el.length === 2 ? (
                day(el[1], id * 2 + 1)
              ) : (
                <>
                  <td className="w25"></td>
                  <td className="w25"></td>
                </>
              )}
            </tr>
          );
        });
    } else
      return (
        <tr>
          <td colSpan={2} className="w-100">
            Loading...
          </td>
        </tr>
      );
  };

  return (
    <Base className="py-5">
      <div className="container">
        <div className="custom-table-small mx-auto text-center">
          <TableHead>
            <th className="ps-4 w-50">
              <span
                className="float-start px-1"
                onClick={() => setDate(date.subtract(1, "month"))}>
                <AiFillLeftCircle />
              </span>
              {rollNo}
            </th>
            <th className="w-50 pe-4">
              {attendance.hostel}
              <span
                className="float-end px-1"
                onClick={() => setDate(date.add(1, "month"))}>
                <AiFillRightCircle />
              </span>
            </th>
          </TableHead>

          <TableBody>{attRender(attendance.attendance)}</TableBody>
        </div>
      </div>
    </Base>
  );
};

export default StudentAttendance;
