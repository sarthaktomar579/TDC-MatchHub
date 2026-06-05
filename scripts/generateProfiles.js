const fs = require('fs');
const path = require('path');

const firstNamesMale = ["Aarav", "Vihaan", "Aditya", "Arjun", "Sai", "Rohan", "Krishna", "Ishaan", "Kabir", "Aryan"];
const firstNamesFemale = ["Ananya", "Diya", "Sanya", "Kavya", "Myra", "Aadhya", "Riya", "Aarohi", "Zara", "Meera"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Patel", "Reddy", "Kumar", "Mehta", "Iyer", "Nair"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"];
const colleges = ["IIT Bombay", "Delhi University", "VIT", "BITS Pilani", "Manipal University", "SRM University"];
const degrees = ["B.Tech", "B.Sc", "B.A", "B.Com", "BBA", "MBBS"];
const companies = ["TCS", "Infosys", "Google", "Amazon", "Microsoft", "Wipro", "Accenture", "StartUp Inc"];
const designations = ["Software Engineer", "Product Manager", "Data Analyst", "Consultant", "HR Manager", "Operations Lead"];
const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain"];
const castes = ["Brahmin", "Rajput", "Bania", "Yadav", "Kayastha", "Not Specified"];
const languages = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Gujarati"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProfiles(count) {
  const profiles = [];
  for (let i = 1; i <= count; i++) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? "Male" : "Female";
    const firstName = isMale ? randomChoice(firstNamesMale) : randomChoice(firstNamesFemale);
    const lastName = randomChoice(lastNames);
    
    // Generate age between 22 and 35
    const age = randomInt(22, 35);
    const currentYear = new Date().getFullYear();
    const dobYear = currentYear - age;
    const dobMonth = randomInt(1, 12).toString().padStart(2, '0');
    const dobDay = randomInt(1, 28).toString().padStart(2, '0');
    
    const heightInches = isMale ? randomInt(65, 75) : randomInt(60, 68);
    const height = `${Math.floor(heightInches / 12)}'${heightInches % 12}"`;
    
    profiles.push({
      id: `CUST${i.toString().padStart(4, '0')}`,
      firstName,
      lastName,
      gender,
      dateOfBirth: `${dobYear}-${dobMonth}-${dobDay}`,
      age,
      country: "India",
      city: randomChoice(cities),
      height,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phoneNumber: `+91 98${randomInt(10000000, 99999999)}`,
      undergraduateCollege: randomChoice(colleges),
      degree: randomChoice(degrees),
      income: randomInt(5, 50) * 100000, // 5L to 50L
      currentCompany: randomChoice(companies),
      designation: randomChoice(designations),
      maritalStatus: randomChoice(["Never Married", "Never Married", "Divorced", "Awaiting Divorce"]),
      languagesKnown: [randomChoice(["English", "Hindi"]), randomChoice(languages)].filter((v, i, a) => a.indexOf(v) === i),
      siblings: randomInt(0, 3),
      religion: randomChoice(religions),
      caste: randomChoice(castes),
      wantKids: randomChoice(["Yes", "No", "Maybe"]),
      openToRelocate: randomChoice(["Yes", "No", "Maybe"]),
      openToPets: randomChoice(["Yes", "No", "Maybe"]),
      diet: randomChoice(["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"]),
      smoking: randomChoice(["No", "Occasionally", "Yes"]),
      drinking: randomChoice(["No", "Socially", "Yes"]),
      statusTag: randomChoice(["New Lead", "In Discussion", "Meeting Scheduled", "Profile Sent", "Active Searching"])
    });
  }
  return profiles;
}

const profiles = generateProfiles(150);

// Add matchmakers
const matchmakers = [
  {
    id: "MM001",
    username: "admin",
    password: "password", // In a real app, hash this!
    name: "Admin Matchmaker"
  }
];

// Assign some profiles to the matchmaker
const assignedCustomers = profiles.slice(0, 20).map(p => p.id);

const mockDB = {
  matchmakers,
  profiles,
  assignments: {
    "MM001": assignedCustomers
  }
};

const dir = path.join(__dirname, '../data');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.writeFileSync(path.join(dir, 'mockDB.json'), JSON.stringify(mockDB, null, 2));
console.log('Successfully generated 150 dummy profiles and mock DB in data/mockDB.json');
