import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween)

/**
 * 
 * @param {string} date date to compare
 * @param {object} range range object containing 2 keys "from" and "to"
 * @returns wether date is between range
 */
function isDayBetween(date, range) {
    return dayjs(date).isBetween(dayjs(range.from), dayjs(range.to),'date','[]');
}

export {
    isDayBetween,
}