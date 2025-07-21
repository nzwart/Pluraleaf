// event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
document.addEventListener('DOMContentLoaded', function () {
    const createPinBtn = document.getElementById("createPinBtn");
    const pinTable = document.getElementById("pinTable");
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populatePinTable() {
        // clear existing rows except the header
        while (pinTable.rows.length > 1) {
            pinTable.deleteRow(1);
        }

        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch('/pins/');
            const pins = await response.json();

            pins.forEach((pin) => {
                // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
                let newPinRow = pinTable.insertRow();
                console.log(pin);
                newPinRow.insertCell(0).textContent = pin.pinID; 
                console.log(pin);
                // populate user by userid
                (async () => {
                    newPinRow.insertCell(1).textContent = await getUserName(pin.userID);
                })(); 
                // populate category by id
                (async () => {
                    newPinRow.insertCell(2).textContent = await getCategoryName(pin.categoryID);
                })();
                newPinRow.insertCell(3).textContent = pin.title;
                newPinRow.insertCell(4).textContent = pin.description;
                newPinRow.insertCell(5).textContent = pin.latitude;
                newPinRow.insertCell(6).textContent = pin.longitude;
                newPinRow.insertCell(7).textContent = pin.createdAt;
            });
        } catch (error) {
            console.error('Failed to fetch pins:', error);
        }
    }
    // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
    createPinBtn.addEventListener("click", addNewPinRow);
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function getUserName(userID) {
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch(`/users/` + userID);
            const user = await response.json();
            const userName = `${user.firstName} ${user.lastName}`;
            return userName;
        }
        catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function getCategoryName(categoryID) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            console.log("here is", categoryID);
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch(`/categories/` + categoryID);
            const category = await response.json();
            const categoryName = category.name;
            return categoryName;
        }
        catch (error) {
            console.error("Failed to fetch category:", error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateUserDropdown(userDropdown) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch("/users/");
            const users = await response.json();

            users.forEach((user) => {
                const option = document.createElement("option");
                option.value = user.userID; 
                option.textContent = `${user.firstName} ${user.lastName}`; 
                userDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateCategoryDropdown(categoryDropdown) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch("/categories/");
            const categories = await response.json();

            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.categoryID; 
                option.textContent = `${category.name}`; 
                categoryDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function addNewPinRow() {
        // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
        const newRow = pinTable.insertRow();
        newRow.insertCell(0).appendChild(document.createTextNode('Auto-Generated'));
        const userDropdown = document.createElement("select");
        populateUserDropdown(userDropdown); 
        newRow.insertCell(1).appendChild(userDropdown);


        const categoryDropdown = document.createElement("select");
        populateCategoryDropdown(categoryDropdown); 
        newRow.insertCell(2).appendChild(categoryDropdown);

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Title";
        newRow.insertCell(3).appendChild(titleInput);

        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.placeholder = "Description";
        newRow.insertCell(4).appendChild(descriptionInput);

        const latitudeInput = document.createElement("input");
        latitudeInput.type = "text";
        latitudeInput.placeholder = "Latitude";
        newRow.insertCell(5).appendChild(latitudeInput);

        const longitudeInput = document.createElement("input");
        longitudeInput.type = "text";
        longitudeInput.placeholder = "Longitude";
        newRow.insertCell(6).appendChild(longitudeInput);

        
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("btn", "btn-success");
        const saveCell = newRow.insertCell(7);
        saveCell.appendChild(saveBtn);
        // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
        saveBtn.addEventListener("click", async function () {
            // validation is our own original work
            if (!titleInput.value.trim() || !descriptionInput.value.trim()) {
                alert("Title and description are required.");
                return; 
            }
        
            
            const latitude = parseFloat(latitudeInput.value);
            if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                alert("Please enter a valid latitude (-90 to 90).");
                return; 
            }
        
           
            const longitude = parseFloat(longitudeInput.value);
            if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                alert("Please enter a valid longitude (-180 to 180).");
                return; 
            }

            const newPin = {
                userID: userDropdown.value,
                categoryID: categoryDropdown.value,
                title: titleInput.value,
                description: descriptionInput.value,
                latitude: latitudeInput.value,
                longitude: longitudeInput.value,
                
            };
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                const response = await fetch('/pins/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPin),
                });

                if (response.ok) {
                    populatePinTable(); 
                } else {
                    console.error('Failed to create pin:', await response.text());
                }
            } catch (error) {
                console.error('Failed to send pin:', error);
            }
        });
    }

    populatePinTable(); 
});
