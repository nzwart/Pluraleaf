
// event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
document.addEventListener('DOMContentLoaded', async function () {
    const createCategoryBtn = document.getElementById("createCategoryBtn");
    const categoriesTable = document.getElementById("categoriesTable");

    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function populateCategoriesTable() {
        // delete all rows except first
        while (categoriesTable.rows.length > 1) {
            categoriesTable.deleteRow(1);
        }

        // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
        try {
            const response = await fetch('/categories/');
            const categories = await response.json();
            // populate table rows
            categories.forEach((category) => {
                // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
                let newCategoryRow = categoriesTable.insertRow();
                newCategoryRow.insertCell(0).textContent = category.categoryID;
                newCategoryRow.insertCell(1).textContent = category.name;
                newCategoryRow.insertCell(2).textContent = category.description;
            });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }
    // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
    createCategoryBtn.addEventListener("click", addNewCategoryRow);
    // async function adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function accessed on 2/25
    async function addNewCategoryRow() {
        // insert row/cell adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell accessed on 2/26
        const newRow = categoriesTable.insertRow(-1); 
        const newCategoryRowHTML = `
            <td><input type="text" placeholder="Auto-Generated" disabled/></td>
            <td><input type="text" required placeholder="name"/></td>
            <td><input type="text" required placeholder="description"/></td>
            <td><button class="btn btn-success saveBtn">Save</button></td>
        `;
        newRow.innerHTML = newCategoryRowHTML;
        // event listener adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener accessed on 2/10
        newRow.querySelector(".saveBtn").addEventListener("click", async function() {
            // get the inputs
            const inputs = newRow.querySelectorAll("input[type='text']");
            const nameInput = inputs[1].value.trim();
            const descriptionInput = inputs[2].value.trim();
            // form validation entirely our own work
            if (!nameInput || !descriptionInput) {
                alert("Please fill in all required fields.");
                return; 
            }
            // prep data for post
            const newCategory = {
                name: nameInput,
                description: descriptionInput,
            };
            // try catch logic adapted from MDN docs here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch accessed on 2/25
            try {
                const response = await fetch('/categories/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCategory),
                });

                if (response.ok) {
                    populateCategoriesTable(); 
                } else {
                    console.error('Failed to create category:', await response.text());
                }
            } catch (error) {
                console.error('Failed to send category:', error);
            }
        });
    }

    await populateCategoriesTable();
});
