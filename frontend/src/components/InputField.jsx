import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputField.css";

export default function InputField({ label, type, value, onChange, name }) {
  /* only password fields are toggle-able */
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-field">
      <label>{label}</label>

      <div className="input-wrapper">
        <input
          type={isPassword && !visible ? "password" : "text"}
          value={value}
          onChange={onChange}
          name={name}
          required
        />

        {isPassword && (
          /* eye icon */
          <span
            className="eye-toggle"
            onClick={() => setVisible(v => !v)}
            title={visible ? "Hide password" : "Show password"}
          >
            {visible ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
}
