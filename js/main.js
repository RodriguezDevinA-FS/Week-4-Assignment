// Get the DOM Elements
const addEmployeeForm = document.getElementById(`addEmployee`);
const employeeListBody = document.getElementById(`employeeListBody`);

// Input fields for adding/editing employees
const nameInput = document.getElementById(`name`);
const ageInput = document.getElementById(`age`);
const hoursInput = document.getElementById(`hours`);
const payRateInput = document.getElementById(`payRate`);

// Edit Functionality
const submitButton = addEmployeeForm.querySelector(`button[type="submit"]`);
const employeeIdToEditInput = document.createElement(`input`);
employeeIdToEditInput.type = `hidden`;
employeeIdToEditInput.id = `employeeIdToEdit`;
employeeIdToEditInput.value = `-1`;
addEmployeeForm.appendChild(employeeIdToEditInput);

// Variable for employee ID
let employeeId = 1;

// Array to store all employee objects
// 3 Hardcoded Employees
let employees = [
  { id: employeeId++, name: `Arianna`, age: 22, hours: 60, payRate: 40 },
  { id: employeeId++, name: `Caleb`, age: 37, hours: 35, payRate: 25 },
  { id: employeeId++, name: `Roberto`, age: 19, hours: 42, payRate: 32 },
];

// Function to calculate role for each employee (FT/PT)
function determineType(hours) {
  if (hours >= 40) {
    return `Manager`;
  } else {
    return `Part-Time`;
  }
}

// Function to calculate salary for each employee
function calculateAnnualSalary(type, payRate, hours) {
  let salary = 0;

  // If the employee is a Manager, calculate full-time salary
  if (type === `Manager`) {
    // Annual salary for full-time
    salary = payRate * 40 * 52 - 1000;
  }
  // If the employee is Part-Time, calculate part-time salary
  else {
    // Annual salary for part-time
    salary = payRate * hours * 52;
  }
  // Return the calculated salary
  return salary;
}

// Function to display all Employees
function displayEmployees() {
  // Clear the existing employee list body
  employeeListBody.innerHTML = ``;

  // Loop through each employee and create a div row
  employees.forEach((employee) => {
    // Determine the type of employee (Manager or Part-Time)
    const type = determineType(employee.hours);
    const salary = calculateAnnualSalary(
      type,
      employee.payRate,
      employee.hours
    );

    // If the employee is a Manager and has more than 40 hours, display only 40 hours
    let hoursToDisplay = employee.hours;
    // If the employee is a Manager, cap the hours at 40 for display
    if (type === `Manager` && employee.hours > 40) {
      hoursToDisplay = 40;
    }

    // Create a new div for each employee row
    const employeeRowDiv = document.createElement(`div`);
    employeeRowDiv.classList.add(`employee-row`); // Add a class for styling consistent with CSS

    // Set the inner HTML of the employee row with the employee's data
    employeeRowDiv.innerHTML = `
            <div>${employee.id}</div>
            <div>${employee.name}</div>
            <div>${employee.age}</div>
            <div>${type}</div>
            <div>$${employee.payRate}</div>
            <div>${hoursToDisplay}</div>
            <div>$${salary}</div>
            <div>
                <button class="edit-button" data-employee-id="${employee.id}">Edit</button>/
                <button class="remove-button" data-employee-id="${employee.id}">Remove</button>
            </div>
        `;
    // Append the employee row div to the employee list body
    employeeListBody.appendChild(employeeRowDiv);

    // Attach event listeners directly to each button using employeeRowDiv
    const editButton = employeeRowDiv.querySelector(`.edit-button`);
    const removeButton = employeeRowDiv.querySelector(`.remove-button`);

    // Edit button functionality
    editButton.addEventListener("click", function () {
      // Get the employee ID from the button's data attribute
      const employeeId = parseInt(this.dataset.employeeId);
      let employeeToEdit = null;

      // Manual loop to find the employee
      for (let i = 0; i < employees.length; i++) {
        // Check if the current employee's ID matches the one being edited
        if (employees[i].id === employeeId) {
          employeeToEdit = employees[i];
          break;
        }
      }

      // If the employee exists, populate the form with their data
      if (employeeToEdit) {
        nameInput.value = employeeToEdit.name;
        ageInput.value = employeeToEdit.age;
        hoursInput.value = employeeToEdit.hours;
        payRateInput.value = employeeToEdit.payRate;

        // Set the hidden input to the ID of the employee being edited
        employeeIdToEditInput.value = employeeId;
        submitButton.textContent = "Update Employee";
        nameInput.readOnly = true;
        ageInput.readOnly = true;
      }
    });

    // Remove button functionality
    removeButton.addEventListener("click", function () {
      // Get the employee ID from the button's data attribute
      const employeeId = parseInt(this.dataset.employeeId);

      // Filter out the employee to remove (reconstruct the array)
      const updatedEmployees = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].id !== employeeId) {
          updatedEmployees.push(employees[i]);
        }
      }

      // Update the main employees array
      employees = updatedEmployees;

      // Re-display the employees after removal
      displayEmployees();

      // If the removed employee was the one being edited, reset the form state
      if (parseInt(employeeIdToEditInput.value) === employeeId) {
        addEmployeeForm.reset();
        employeeIdToEditInput.value = "-1";
        submitButton.textContent = "Add Employee";
        nameInput.readOnly = false;
        ageInput.readOnly = false;
      }
    });
  });
}

// Handle Form Submission (Adding/Updating Employees)
addEmployeeForm.addEventListener(`submit`, function (e) {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Validate form inputs
  const name = nameInput.value;
  const age = parseInt(ageInput.value);
  const hours = parseInt(hoursInput.value);
  const payRate = parseFloat(payRateInput.value);

  // Check if all fields are filled and valid
  if (!name || isNaN(age) || isNaN(payRate) || isNaN(hours)) {
    alert(`Please fill in all fields correctly.`);
    return;
  }

  const currentEditId = parseInt(employeeIdToEditInput.value);

  if (currentEditId === -1) {
    // Adding a new employee
    const newEmployee = {
      id: employeeId++,
      name: name,
      age: age,
      payRate: payRate,
      hours: hours,
    };
    // Add the new employee to the employees array
    employees.push(newEmployee);
  } else {
    // Editing an existing employee
    let employeeToUpdate = null;
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].id === currentEditId) {
        employeeToUpdate = employees[i];
        break;
      }
    }

    // Update the employee's data
    if (employeeToUpdate) {
      employeeToUpdate.hours = hours;
      employeeToUpdate.payRate = payRate;
    }

    // Reset edit state
    employeeIdToEditInput.value = `-1`;
    submitButton.textContent = `Add Employee`;
    nameInput.readOnly = false;
    ageInput.readOnly = false;
  }

  // Reset the form
  addEmployeeForm.reset();
  displayEmployees();
});

// Initial display of employees
displayEmployees();
