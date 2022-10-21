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
  const [date, setDate] = useState(moment().startOf("month").toDate());
  const [dateList, setDateList] = useState([]);
  const { rollNo } = useParams();

  const [status, setStatus] = useState({
    loading: true,
    error: "",
    server: false,
  });
  const { loading, error, server } = status;

  useEffect(() => {
    setStatus({ loading: true, error: "", server: false });
    let queryDate = moment(date);
    const data = {
      rollNo,
      startDate: queryDate.toISOString(),
      endDate: queryDate.endOf("month").toISOString(),
    };

    attendanceAPI(user._id, token, JSON.stringify(data)).then((res) => {
      if (res.error) {
        setStatus({
          loading: false,
          error: res.error,
          server: res.server,
        });
        setAttendance([]);
      } else {
        setStatus({ loading: false, error: "", server: false });
        setAttendance(res[0]);
      }
    });

    setDateList(dates("month", date));
  }, [date]);

  const attRender = (data) => {
    if (data) {
      let ar = dateList.map((dt) => ({ date: dt, value: false }));
      data.forEach((el) => (ar[moment(el).date() - 1].value = moment(el)));

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
    }
  };

  const heading = (data) => {
    if (loading) return "Loading...";
    else if (error) return server ? "Error" : moment(date).format("MMMM YYYY");
    else return data;
  };

  return (
    <Base className="py-5">
      <div className="container">
        <div className="custom-table-small mx-auto text-center">
          <TableHead>
            <th className="ps-4 w-50">
              <span
                className="float-start mx-1"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (!moment(date).isSame(moment().startOf("year")))
                    setDate(moment(date).subtract(1, "month").toDate());
                }}>
                <AiFillLeftCircle />
              </span>
              {rollNo}
            </th>
            <th className="w-50 pe-4">
              {heading(attendance.hostel)}
              <span
                className="float-end mx-1"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (!moment(date).isSame(moment().startOf("month")))
                    setDate(moment(date).add(1, "month").toDate());
                }}>
                <AiFillRightCircle />
              </span>
            </th>
          </TableHead>

          <TableBody>
            {attRender(attendance.attendance)}
            {loading && (
              <tr>
                <td colSpan={2} className="text-center text-info">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td
                  colSpan={2}
                  className={`text-center ${
                    server ? "text-danger" : "text-info"
                  }`}>
                  {error}
                </td>
              </tr>
            )}
          </TableBody>
        </div>
      </div>
    </Base>
  );
};

export default StudentAttendance;
