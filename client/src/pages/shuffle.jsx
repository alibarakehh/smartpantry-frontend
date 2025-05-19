

import React, { useState, useEffect } from "react";
import SearchBar from "../components/Search/SearchBar";
import RecipeCard from "../components/Search/RecipeCard";
import  "../components/Search/searchView.css" 

const searchApi = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

function SearchView() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);

  // Search for the recipe
  const searchRecipes = async () => {
    setIsLoading(true);
    const url = searchApi + query;
    const res = await fetch(url);
    const data = await res.json();
    setRecipes(data.meals);
    setIsLoading(false);
  };

  useEffect(() => {
    searchRecipes();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    searchRecipes();
  };

  const handleRandomRecipe = () => {
    // Select a random recipe from the recently searched ones
    const randomIndex = Math.floor(Math.random() * recipes.length);
    setRandomRecipe(recipes[randomIndex]);
  };

  return (
    <div className="container container-recipe search-view-bg">
      <h2 className="h2-recipe">Our Food Recipes</h2>
      <SearchBar isLoading={isLoading} query={query} setQuery={setQuery} handleSubmit={handleSubmit} />
      <button onClick={handleRandomRecipe} className="random-recipe-button">
        Show Random Recipe
      </button>
      <div className="recipes">
        {randomRecipe ? (
          <RecipeCard key={randomRecipe.idMeal} recipe={randomRecipe} />
        ) : recipes ? (
          recipes.map((recipe) => <RecipeCard key={recipe.idMeal} recipe={recipe} />)
        ) : (
          "No Results."
        )}
      </div>
    </div>
  );
}

export default SearchView;
