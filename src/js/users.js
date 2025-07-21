
// event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
document.addEventListener('DOMContentLoaded', function () {
    const createUserBtn = document.getElementById("createUserBtn");
    const userTable = document.getElementById("userTable");
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateUserTable() {
        while(userTable.rows.length > 1) {
            // delete all rows except first
            userTable.deleteRow(1);
        }
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch('/users/');
            const users = await response.json();

            users.forEach((user) => {
                // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
                let newUserRow = userTable.insertRow();
                // populate cells
                newUserRow.insertCell(0).textContent = user.userID;
                newUserRow.insertCell(1).textContent = user.firstName;
                newUserRow.insertCell(2).textContent = user.lastName;
                newUserRow.insertCell(3).textContent = user.email;
                newUserRow.insertCell(4).textContent = user.phoneNumber;
                newUserRow.insertCell(5).textContent = user.passwordHash;
                newUserRow.insertCell(6).textContent = user.createdAt;
            });
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }
    // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
    createUserBtn.addEventListener("click", addNewUserRow);

    function addNewUserRow() {
        // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
        const newRow = userTable.insertRow();
        newRow.insertCell(0).textContent = "Auto-Populated";
        
        const userDataKeys = ['firstName', 'lastName', 'email', 'phoneNumber', 'passwordHash'];
        // add input for each key
        // this was my original work and it was stupid but trying to fix it broke everything
        userDataKeys.forEach((key, index) => {
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Enter ${key}`;
            newRow.insertCell(index + 1).appendChild(input);
        });
        // add save button
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("btn", "btn-success");
        newRow.insertCell(userDataKeys.length + 1).appendChild(saveBtn);
    
        saveBtn.addEventListener("click", async function() {
            const newUser = {};
            // email and phone regex adapted from here: https://forum.uipath.com/t/how-to-validate-phone-number-and-email-using-regex/361499/2 accessed on 3/12
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            const phoneRegex = /^\d{10,}$/; 
            let isValid = true;
            userDataKeys.forEach((key, index) => {
                const input = newRow.cells[index+ 1].querySelector("input");
                const value = input.value.trim();
                
                if (!value) { 
                    alert(`${key} is required.`);
                    isValid = false;
                    // regex test adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test accessed on 3/12
                } else if (key === 'email' && !emailRegex.test(value)) {
                    alert(`Please enter a valid email address.`);
                    isValid = false;
                } else if (key === 'phoneNumber' && !phoneRegex.test(value.replace(/\D/g,''))) { 
                    alert(`Please enter a valid phone number.`);
                    isValid = false;
                } else if (key === 'passwordHash' && value.length < 8) { 
                    alert(`Hash must be at least 8 characters long.`);
                    isValid = false;
                }

                newUser[key] = input.value;
            });
            if (!isValid) return;
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                const response = await fetch('/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
    
                if (response.ok) {
                    
                    const createdUser = await response.json();
                    
                    populateUserTable();
                } else {
                    console.error('Failed to create user:', await response.text());
                }
            } catch (error) {
                console.error('Failed to send user:', error);
            }
    
            newRow.remove();
        });
    }

    populateUserTable(); 
});
