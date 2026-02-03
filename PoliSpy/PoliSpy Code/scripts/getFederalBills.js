
// Replace YOUR_API_KEY_HERE with your real Congress.gov API key
const API_KEY = "pN8xPJ1MFzwZTHZNda7zkcdtaAUrbiPcCmMIoBmz";

// Base URL for the Congress.gov API
const BASE_URL = "https://api.congress.gov/v3/bill"; // Example endpoint

// Function to fetch bills
async function getBills(congressNumber = 118, chamber = "house") {
    try {
        // Build the API URL
        const url = `${BASE_URL}?congress=${congressNumber}&chamber=${chamber}&api_key=${API_KEY}`;

        // Make the API request
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log the first few bills
        console.log("Bills from Congress.gov:", data.bills);
        return data;
    } catch (error) {
        console.error("Error fetching bills:", error);
    }
}

// Example usage
getBills();



async function getBillText(billId) {
    const url = `https://api.congress.gov/v3/bill/${billId}?api_key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // The text is usually in data.versions or data.latestSummary (depends on API)
    return data.latestSummary?.text || "No text available";
}

const text = await getBillText("hr899");
console.log(text);