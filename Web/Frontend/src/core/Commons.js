export const API = "http://localhost:8000/api";

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

export const Loading = ({ loading }) =>
  loading && (
    <div className="row mt-4 text-center">
      <div className="col-md-6 offset-sm-3 alert-info rounded py-2">
        <h2>Loading...</h2>
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
