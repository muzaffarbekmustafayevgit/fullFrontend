import React from "react";

function Date() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = month + "/" + date + "/" + year;
  return <div>
    {currentDate}
  </div>;
}

export default Date;
