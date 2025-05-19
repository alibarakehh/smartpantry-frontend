// import React, { useState, useEffect } from "react";
// import SearchBar from "../components/Search/SearchBar";
// import RecipeCard from "../components/Search/RecipeCard";
// import  "../components/Search/searchView.css" ;
// const searchApi = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// function SearchView() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [query, setQuery] = useState("");
//   const [recipes, setRecipes] = useState([]);
  
//   // search for the recipe
//   const searchRecipes = async () => {
//     setIsLoading(true);
//     const url = searchApi + query
//     const res = await fetch(url);
//     const data = await res.json();
//     setRecipes(data.meals);
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     searchRecipes()
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     searchRecipes();
//   }

//   return (
//     <div className="container">
//       <h2>Our Food Recipes</h2>
//       <SearchBar
//         isLoading={isLoading}
//         query={query}
//         setQuery={setQuery}
//         handleSubmit={handleSubmit}
//       />
//       <div className="recipes">
        
//         {recipes ? recipes.map(recipe => (
//           <RecipeCard
//              key={recipe.idMeal}
//              recipe={recipe}
//           />
//         )) : "No Results."}
//       </div>
//     </div>
//   );
// }

// export default SearchView;
import React, { useState, useEffect } from "react";
import SearchBar from "../components/Search/SearchBar";
import RecipeCard from "../components/Search/RecipeCard";
import  "../components/Search/searchView.css" ;

const searchApi = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

function SearchView() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div className="container container-recipe search-view-bg">
      <h2 className="h2-recipe">Our Food Recipes</h2>
      <SearchBar isLoading={isLoading} query={query} setQuery={setQuery} handleSubmit={handleSubmit} />
      <div className="recipes">
        {recipes ? recipes.map((recipe) => <RecipeCard key={recipe.idMeal} recipe={recipe} />) : "No Results."}
      </div>
    </div>
  );
}

export default SearchView;
