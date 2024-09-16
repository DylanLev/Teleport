// date.js

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  export function validateDate(date) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])(\d{2})$/;
    return dateRegex.test(date);
  }
  
  export function formatDate(date) {
    const day = date.slice(0, 2);
    const monthIndex = parseInt(date.slice(2, 4), 10) - 1;
    const year = parseInt(date.slice(4), 10);
    const fullYear = year + 2000; // Assuming all years are in the 21st century
  
    return `${months[monthIndex]} ${parseInt(day, 10)}, ${fullYear}`;
  }