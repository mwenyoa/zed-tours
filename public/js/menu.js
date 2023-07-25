
export const convertDate = (date) => {
    const dt = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dt.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  };