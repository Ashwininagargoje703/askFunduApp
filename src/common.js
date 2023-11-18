const conciseTime = (arr) => {
  if (arr[1] === "sec" && arr[0] >= 60) {
    let temp = Math.floor(arr[0] / 60);
    arr = [temp, "min"];
    return conciseTime(arr);
  } else if (arr[1] === "min" && arr[0] >= 60) {
    let temp = Math.floor(arr[0] / 60);
    arr = [temp, "h"];
    return conciseTime(arr);
  } else if (arr[1] === "h" && arr[0] >= 24) {
    let temp = Math.floor(arr[0] / 24);
    arr = [temp, "d"];
    return conciseTime(arr);
  } else if (arr[1] === "d" && arr[0] >= 7) {
    let temp = Math.floor(arr[0] / 7);
    arr = [temp, "w"];
    return conciseTime(arr);
  } else if (arr[1] === "w" && arr[0] >= 4) {
    let temp = Math.floor(arr[0] / 4);
    arr = [temp, "M"];
    return conciseTime(arr);
  } else if (arr[1] === "M" && arr[0] >= 12) {
    let temp = Math.floor(arr[0] / 12);
    arr = [temp, "y"];
    return conciseTime(arr);
  } else {
    return arr;
  }
};

export const time_difference = (date1) => {
  let newtime = new Date(date1);
  let diff = (new Date() - new Date(newtime)) / 1000;
  let sec = Math.abs(Math.round(diff));
  let arr = [sec, "sec"];
  return conciseTime(arr);
};

export const formatDate = (date) => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const Month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();

  const months_name = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day} ${months_name[Month]} ${year}`;
};

export const checkFollow = (myFollowings, currentUser) => {
  let isFollowed = false;
  if (myFollowings?.length > 0) {
    myFollowings?.forEach((item) => {
      if (item?.userId?.username == currentUser) {
        isFollowed = true;
        return;
      }
    });
  }
  return isFollowed;
};

const filterWhichDoNotHaveSlots = (arr) => {
  arr = arr.filter((item) => item && item.available_slots.length !== 0);
  return arr;
};

const filterDatesWhichAreOlder = (arr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set current time to midnight for accurate comparison

  // Filter slots with booking_day greater than or equal to today
  const filteredSlots = arr.filter((slot) => {
    const [day, month, year] = slot.booking_day.split("-");
    const slotDate = new Date(year, month - 1, day); // month is 0-indexed

    return slotDate >= today;
  });
  return filteredSlots;
};

export const sortAvailableSlotsByDate = (slots) => {
  slots = filterDatesWhichAreOlder(slots);
  slots = filterWhichDoNotHaveSlots(slots);
  slots.sort((a, b) => {
    const dateA = new Date(
      parseInt(a.booking_day.slice(6, 10)), // year
      parseInt(a.booking_day.slice(3, 5)) - 1, // month (0-indexed)
      parseInt(a.booking_day.slice(0, 2)) // day
    );
    const dateB = new Date(
      parseInt(b.booking_day.slice(6, 10)), // year
      parseInt(b.booking_day.slice(3, 5)) - 1, // month (0-indexed)
      parseInt(b.booking_day.slice(0, 2)) // day
    );
    return dateA - dateB;
  });
  // console.log(arr);
  return slots;
};

export const sortAvailableSlotsTime = (timeArr) => {
  timeArr = timeArr.sort((slotA, slotB) => {
    const fromA = slotA.from;
    const fromB = slotB.from;

    // Compare the hour part (first element) of the "from" array
    if (fromA[0] < fromB[0]) {
      return -1;
    } else if (fromA[0] > fromB[0]) {
      return 1;
    }

    // If the hour part is the same, compare the minute part (second element) of the "from" array
    if (fromA[1] < fromB[1]) {
      return -1;
    } else if (fromA[1] > fromB[1]) {
      return 1;
    }

    return 0;
  });
  return timeArr;
};

export const capitalFirstLetter = (string) => {
  const firstLetter = string && string[0].toUpperCase();
  const restLetter = string && string.substring(1).toLowerCase();
  return firstLetter + restLetter;
};

export function convertTimeTo12HourFormat(time) {
  // Extract hours and minutes from time
  const [hours, minutes] = time.split(":");

  // Convert hours to 12-hour format
  let hours12 = parseInt(hours);
  let ampm = "AM";
  if (hours12 >= 12) {
    hours12 -= 12;
    ampm = "PM";
  }
  if (hours12 === 0) {
    hours12 = 12;
  }
  // Combine hours, minutes, and AM/PM indicator
  return `${hours12}:${minutes} ${ampm}`;
}
