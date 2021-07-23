import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

export const API = "http://localhost:8000/api";
export const HostelList = ["BH1", "BH2", "BH3", "GH"];

export const Error = ({ error }) =>
  error && (
    <div className="row mt-3 text-center">
      <div className="alert-danger rounded py-2">
        {error.split("\n").map((str) => (
          <span>
            {str}
            <br />
          </span>
        ))}
      </div>
    </div>
  );

export const Success = ({ success, text, extraText = "" }) =>
  success && (
    <div className="row mt-3 text-center">
      <div className="alert-success rounded py-2">
        {text} Successfully
        <br />
        {extraText}
      </div>
    </div>
  );

export const FormInputDiv = ({
  id,
  val,
  type = "text",
  focus = false,
  onChange,
  text,
  css = "form-control mb-3",
}) => (
  <div className="form-floating">
    <input
      id={id}
      className={css}
      value={val}
      required
      type={type}
      autoFocus={focus}
      onChange={onChange}
    />
    <label htmlFor={id}>{text}</label>
  </div>
);

export const dates = (duration) => {
  const start = moment().startOf(duration);
  let list = [start.toDate()];
  while (start.isBefore(moment().endOf(duration), "date"))
    list.push(start.add(1, "day").toDate());
  return list;
};

export const attCell = (duration, element, id) => {
  const cls = duration === "week" ? "w-12" : "w-25";
  const comp = duration === "week" ? moment().day() : moment().date();

  return (
    <td className={cls}>
      {id >= comp ? (
        <b>-</b>
      ) : element ? (
        <span className="text-info">{element.format("hh:mm A")}</span>
      ) : (
        <span className="text-danger">A</span>
      )}
    </td>
  );
};

export const TableHead = ({ children }) => (
  <table className="table table-borderless mb-0">
    <thead>
      <tr className="head">{children}</tr>
    </thead>
  </table>
);

export const TableBody = ({ children }) => (
  <SimpleBar style={{ maxHeight: "60vh" }}>
    <table className="table table-borderless mb-0">
      <tbody className="body">{children}</tbody>
    </table>
  </SimpleBar>
);
