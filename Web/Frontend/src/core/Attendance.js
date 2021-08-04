import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
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
  const [date, setDate] = useState(moment().startOf("week").toDate());
  const [dateList, setDateList] = useState([]);

  const location = useLocation();
  const hostel = location.state ? location.state.hostel : "BH2";

  const [status, setStatus] = useState({
    loading: true,
    error: "",
    server: false,
  });
  const { loading, error, server } = status;

  useEffect(() => {
    setDateList(dates("week", date));
  }, [date]);

  useEffect(() => {
    setStatus({ loading: true, error: "", server: false });
    let queryDate = moment(date);
    const data = {
      hostel,
      startDate: queryDate.toISOString(),
      endDate: queryDate.endOf("week").toISOString(),
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
        setAttendance(res);
      }
    });
  }, [hostel, date]);

  const attRender = () => {
    let ar = dateList.map((dt) => ({ date: dt, value: false }));
    attendance.forEach((att) =>
      att.attendance.forEach((el) => (ar[moment(el).day() - 1].value = el))
    );
    return ar.map((el, i) => attCell("week", el, i));
  };

  return (
    <Base className="py-5">
      <div className="container">
        <div className="custom-table">
          <TableHead>
            <th className="w-18">
              <span
                className="float-start ps-1 pe-4"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (
                    !moment(date).isSame(
                      moment().startOf("month").startOf("week")
                    )
                  )
                    setDate(moment(date).subtract(1, "week").toDate());
                }}>
                <AiFillLeftCircle />
              </span>
              Roll No
            </th>
            {dateList.map((el, id) => (
              <th key={id} className="w-12">
                {moment(el).format("DD MMM")}
                {id === 6 ? (
                  <span
                    className="float-end px-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!moment(date).isSame(moment().startOf("week")))
                        setDate(moment(date).add(1, "week").toDate());
                    }}>
                    <AiFillRightCircle />
                  </span>
                ) : (
                  <></>
                )}
              </th>
            ))}
          </TableHead>

          <TableBody>
            {attendance.map((att, id) => (
              <tr key={id}>
                <td className="ps-4 w-18">
                  <Link
                    className="text-decoration-none text-warning"
                    to={`/attendance/${att.rollNo}`}>
                    {att.rollNo}
                  </Link>
                </td>
                {attRender()}
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={8} className="text-center text-info">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td
                  colSpan={8}
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

export default Attendance;
