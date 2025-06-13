/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const recipeListContainer = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const addRecipeSubmitButton = document.getElementById("add-recipe-submit-input");
    const updateRecipeSubmitButton = document.getElementById("update-recipe-submit-input");
    const deleteRecipeSubmitButton = document.getElementById("delete-recipe-submit-input");

    /*
    * TODO: Show logout button if auth-token exists in sessionStorage
    */
   if (sessionStorage.getItem("auth-token")) {
       logoutButton.style.display = "inline";
    }
    
    /*
    * TODO: Show admin link if is-admin flag in sessionStorage is "true"
    */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitButton.addEventListener("click", addRecipe);
    updateRecipeSubmitButton.addEventListener("click", updateRecipe);
    deleteRecipeSubmitButton.addEventListener("click", deleteRecipe);
    searchButton.onclick = searchRecipes;
    logoutButton.onclick = processLogout;

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value.trim();

        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`);
            
            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } 
            else {
                alert("Failed to search recipes.");
            }
        } 
        catch (err) {
            console.error(err);
            alert("Error searching recipes.");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addRecipeNameInput.value.trim();
        const instructions = addRecipeInstructionsInput.value.trim();

        if (!name || !instructions) return alert("Name and instructions are required.");

        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                },
                body: JSON.stringify({ name, instructions })
            });

            if (response.status === 201) {
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value = "";
                await getRecipes();
            } 
            else {
                alert("Failed to add recipe.");
            }
        } 
        catch (err) {
            console.error(err);
            alert("Error adding recipe.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeNameInput.value.trim();
        const instructions = updateRecipeInstructionsInput.value.trim();

        if (!name || !instructions) return alert("Both name and updated instructions are required.");

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) return alert("Recipe not found.");

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                },
                body: JSON.stringify({ name, instructions })
            });

            if (response.ok) {
                updateRecipeNameInput.value = "";
                updateRecipeInstructionsInput.value = "";
                await getRecipes();
            } 
            else {
                alert("Failed to update recipe.");
            }
        } 
        catch (err) {
            console.error(err);
            alert("Error updating recipe.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteRecipeNameInput.value.trim();

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) return alert("Recipe not found.");

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });

            if (response.ok) {
                deleteRecipeNameInput.value = "";
                await getRecipes();
            } 
            else {
                alert("Failed to delete recipe.");
            }
        } 
        catch (err) {
            console.error(err);
            alert("Error deleting recipe.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(`${BASE_URL}/recipes`);

            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } 
            else {
                alert("Failed to fetch recipes.");
            }
        } 
        catch (err) {
            console.error(err);
            alert("Error fetching recipes.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeListContainer.innerHTML = "";

        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${recipe.name}</strong>: ${recipe.instructions}`;
            recipeListContainer.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });

            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "login-page.html";
            } 
            else {
                alert("Logout failed.");
            }
        } 
        catch (err) {
            console.error(err);
            alert("Error during logout.");
        }
    }
});