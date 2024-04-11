export const formatDate = (dateString) => {
    // Convert received date string to a Date object
    const date = new Date(dateString);
    // Format the date as "YYYY-MM-DD"
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
};

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};