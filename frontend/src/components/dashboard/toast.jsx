import React from "react";

export default function Toast({ show, message, type }) {
  if (!show) return null;

  return <div className={`toast-notification ${type}`}>{message}</div>;
}
