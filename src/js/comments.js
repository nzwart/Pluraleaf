// event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
document.addEventListener('DOMContentLoaded', function () {
    const createCommentBtn = document.getElementById("createCommentBtn");
    const commentsTable = document.getElementById("commentsTable");
    let currentCommentID = 5;
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populatePinDropdown(pinDropdown) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch('/pins/');
            const pins = await response.json();
            // fill dropdown
            pins.forEach(pin => {
                const option = document.createElement("option");
                option.value = pin.pinID; 
                option.textContent = pin.title; 
                pinDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to fetch pins:', error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function getUserName(userID) {
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
    async function populateUserDropdown(userDropdown) {
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch('/users/');
            const users = await response.json();
            const nullOption = document.createElement("option");
            nullOption.value = "NULL";
            nullOption.textContent = " - ";
            userDropdown.appendChild(nullOption);
            // fill dropdown
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.userID; 
                option.textContent = `${user.firstName} ${user.lastName}`; 
                userDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateCommentsTable() {
        while (commentsTable.rows.length > 1) {
            commentsTable.deleteRow(1);
        }
        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
            const response = await fetch('/comments/');
            const comments = await response.json();
    
            comments.forEach(async (comment) => {
                // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
                let newCommentRow = commentsTable.insertRow();
                newCommentRow.setAttribute('data-pin-id', comment.pinID);
                newCommentRow.insertCell(0).textContent = comment.commentID;
                newCommentRow.insertCell(1).textContent = await getPinName(comment.pinID);
                // handle null commenter
                const userCell = newCommentRow.insertCell(2);
                if (comment.userID == null) {
                    userCell.textContent = "NULL";
                } else {
                    userCell.textContent = await getUserName(comment.userID);
                }
    
                newCommentRow.insertCell(3).textContent = comment.text;
                newCommentRow.insertCell(4).textContent = comment.createdAt;
    
                // place update button
                const updateBtnCell = newCommentRow.insertCell(5);
                const updateBtn = document.createElement("button");
                updateBtn.textContent = "Update";
                updateBtn.classList.add("btn", "btn-primary");
                updateBtnCell.appendChild(updateBtn);
    
                updateBtn.addEventListener("click", function() {
                    updateUser(comment.commentID, userCell, comment.userID);
                });
            });
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    }
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function updateUser(commentID, userCell, currentUserId) {
        // handle update user dropdown
        const userDropdown = document.createElement("select");
        const nullOption = document.createElement("option");
        nullOption.value = "NULL";
        nullOption.textContent = " - ";
        userDropdown.appendChild(nullOption);
        // add current user option if not null
        if (currentUserId !== null) {
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                const userName = await getUserName(currentUserId);
                const userOption = document.createElement("option");
                userOption.value = currentUserId;
                userOption.textContent = userName;
                userDropdown.appendChild(userOption);
                userDropdown.value = currentUserId; 
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        }


        const commentRow = userCell.parentNode;
        // data attribute adapted from MDN doc here: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes access on 3/12
        const pinID = parseInt(commentRow.getAttribute('data-pin-id'));
        
        if (currentUserId !== null) {
            userDropdown.value = currentUserId;
        }
    
        
        userCell.innerHTML = "";
        userCell.appendChild(userDropdown);
    
        
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("btn", "btn-success");
        
        userCell.parentNode.replaceChild(saveBtn, userCell.parentNode.lastChild);
    
        // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
        saveBtn.addEventListener("click", async function() {
            
            const selectedUserId = userDropdown.value === "NULL" ? null : parseInt(userDropdown.value, 10);
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                const response = await fetch(`/comments/${commentID}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        userID: selectedUserId,
                        pinID: pinID 
                    }),
                });
    
                if (response.ok) {
                    
                    populateCommentsTable(); 
                } else {
                    console.error('Failed to update comment:', await response.text());
                }
            } catch (error) {
                console.error('Failed to update comment:', error);
            }
        });
    }
    
    // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
    createCommentBtn.addEventListener("click", addNewCommentRow);

    function addNewCommentRow() {
        // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
        const newRow = commentsTable.insertRow();
        newRow.insertCell(0).textContent = "Auto-populated";
        const pinDropdown = document.createElement("select");
        populatePinDropdown(pinDropdown); 
        newRow.insertCell(1).appendChild(pinDropdown);
    
        const userDropdown = document.createElement("select");
        populateUserDropdown(userDropdown); 
        newRow.insertCell(2).appendChild(userDropdown);
    
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.placeholder = "Enter comment here";
        newRow.insertCell(3).appendChild(textInput);
    
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("btn", "btn-success");
        newRow.insertCell(4).appendChild(saveBtn);
    
        saveBtn.addEventListener("click", async function() {
            // validation is our own original work
            if (!textInput.value.trim()) { 
                alert("Please enter a comment."); 
                return; 
            }
            // prep data for post
            const newComment = {
                pinID: parseInt(pinDropdown.value, 10),
                userID: parseInt(userDropdown.value, 10),
                text: textInput.value,
            };
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                // fetch function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch accessed on 2/25
                const response = await fetch('/comments/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newComment),
                });
    
                if (response.ok) {
                    populateCommentsTable(); 
                } else {
                    console.error('Failed to create comment:', await response.text());
                }
            } catch (error) {
                console.error('Failed to send comment:', error);
            }
        });
    }
    

    populateCommentsTable(); 
});
