// event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
document.addEventListener("DOMContentLoaded", function () {
    const savePinBtn = document.getElementById("savePinBtn");
    const savedPinTable = document.getElementById("savedPinTable");

    savePinBtn.addEventListener("click", addNewSavedPinRow);
    let currentNewID = 5;
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function getUserName(userID) {
        // get user name from db
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
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
    async function getPinName(pinID) {
        // get pin name from db
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch(`/pins/` + pinID);
            const pin = await response.json();
            const pinName = pin.title;
            return pinName;
        }
        catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populatePinDropdown(pinDropdown) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch("/pins/");
            const pins = await response.json();

            pins.forEach((pin) => {
                const option = document.createElement("option");
                option.value = pin.pinID; 
                option.textContent = pin.title; 
                pinDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to fetch pins:", error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateUserDropdown(userDropdown) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch("/users/");
            const users = await response.json();
            // add each user to the dropdown
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

    function addNewSavedPinRow() {
        // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
        const newRow = savedPinTable.insertRow();

        newRow.insertCell(0).textContent = "Auto-populated";
        const userDropdown = document.createElement("select");
        populateUserDropdown(userDropdown); 
        newRow.insertCell(1).appendChild(userDropdown);

        const pinDropdown = document.createElement("select");
        populatePinDropdown(pinDropdown); 
        newRow.insertCell(2).appendChild(pinDropdown);

       
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("btn", "btn-success");
        newRow.insertCell(3).appendChild(saveBtn); 
        // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
        saveBtn.addEventListener("click", async function () {
            const newSavedPin = {
                userID: userDropdown.value,
                pinID: pinDropdown.value,
                
            };
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                const response = await fetch("/saved-pins/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newSavedPin),
                });

                if (response.ok) {
                    populateSavedPins(); 
                } else {
                    console.error("Failed to save pin:", await response.text());
                }
            } catch (error) {
                console.error("Failed to send saved pin:", error);
            }

            
        });
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateSavedPins() {
        while (savedPinTable.rows.length > 1) {
            savedPinTable.deleteRow(1);
        }
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch("/saved-pins/");
            const pins = await response.json();
            console.log(response);
            pins.forEach((pin) => {
                // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
                let newPinRow = savedPinTable.insertRow();

                newPinRow.insertCell(0).textContent = pin.savedPinID;
                (async () => {
                    newPinRow.insertCell(1).textContent = await getUserName(pin.userID);
                })();
                
                (async () => {
                    newPinRow.insertCell(2).textContent = await getPinName(pin.pinID);
                })();
              
                let savedAtInput = document.createElement("input");
                savedAtInput.type = "date"; 
                savedAtInput.value = pin.savedAt.split("T")[0]; 
                newPinRow.insertCell(3).appendChild(savedAtInput);

                
                let updateBtn = document.createElement("button");
                updateBtn.textContent = "Update";
                updateBtn.classList.add("btn", "btn-info");
                newPinRow.insertCell(4).appendChild(updateBtn);

                // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
                updateBtn.addEventListener("click", async function () {
                    // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
                    try {
                        // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                        const response = await fetch(
                            `/saved-pins/${pin.savedPinID}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    savedAt: savedAtInput.value,
                                }),
                            }
                        );

                        if (response.ok) {
                            alert("Saved pin updated successfully");
                            
                        } else {
                            console.error(
                                "Failed to update saved pin:",
                                await response.text()
                            );
                        }
                    } catch (error) {
                        console.error("Failed to send update request:", error);
                    }
                });

               
                let deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("btn", "btn-danger");
                newPinRow.insertCell(5).appendChild(deleteBtn);

                // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
                deleteBtn.addEventListener("click", async function () {
                    // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
                    try {
                        // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                        const response = await fetch(
                            `/saved-pins/${pin.savedPinID}`,
                            {
                                method: "DELETE",
                            }
                        );

                        if (response.ok) {
                            newPinRow.remove(); 
                        } else {
                            console.error(
                                "Failed to delete pin:",
                                await response.text()
                            );
                        }
                    } catch (error) {
                        console.error("Failed to send delete request:", error);
                    }
                });
            });
        } catch (error) {
            console.error("Failed to fetch pins:", error);
        }
    }


    populateSavedPins();
});
