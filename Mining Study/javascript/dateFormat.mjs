export default function dateFormat(value, flip = false){

//Thanks chatgpt <3

const date = new Date(value);

const day = String(date.getUTCDate()).padStart(2, '0');  // Get the day and pad with zero if needed
const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Get the month (0-indexed, so add 1) and pad with zero if needed
const year = String(date.getUTCFullYear());  // Get the last two digits of the year

if (flip) {
    return `${day}/${month}/${year}`;
} else {
    return `${month}/${day}/${year}`;
}
};
