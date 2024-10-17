import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';

const CocktailsDetails = () => {
    const { id } = useParams();
    const [cocktail, setCocktail] = useState(null);
    const [error, setError] = useState(null);
    const [ingredients, setIngredients] = useState({}); // Initialize as an empty object

    useEffect(() => {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.drinks && data.drinks.length > 0) {
                    setCocktail(data.drinks[0]); // Assuming the API returns an array of drinks
                    let ingredientPromises = [];
                    let newIngredients = {};

                    for (let i = 1; i <= 15; i++) { // The API supports up to 15 ingredients
                        const ingredientName = data.drinks[0][`strIngredient${i}`];
                        if (ingredientName) {
                            newIngredients[ingredientName] = {
                                measure: data.drinks[0][`strMeasure${i}`]
                            };

                            const ingredientUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredientName}`;
                            ingredientPromises.push(
                                fetch(ingredientUrl)
                                    .then(response => response.json())
                                    .then(ingredientData => {
                                        newIngredients[ingredientName]['data'] = ingredientData.ingredients[0];
                                    })
                                    .catch(fetchError => {
                                        setError(fetchError.message);
                                    })
                            );
                        }
                    }

                    // Wait for all ingredient fetches to complete before updating state
                    Promise.all(ingredientPromises).then(() => {
                        setIngredients(newIngredients);
                    });
                }
            })
            .catch(err => {
                setError(err.message);
            });
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!cocktail) {
        return <div>Loading...</div>;
    }

    return (
        <div className={'App'}>
            <header className={'App-header'}>
                <h1 className="card-title w-100 text-center text-white">{cocktail['strDrink']}</h1>
                <figure className={'w-100 me-auto  d-flex justify-content-center ms-auto'}>
                    <img src={cocktail['strDrinkThumb']} className={'w-25'} alt={cocktail['strDrink']} />
                </figure>
                <p className="card-text w-100 text-center text-white">{cocktail['strInstructions']}</p>
                <ul className={'text-white w-100 text-center list-unstyled'}>
                    {Object.entries(ingredients).map(([ingredient, details], index) => (
                        <li key={index} className={'w-100 d-flex justify-content-center'}>
                            <figure className={'w-25'}>
                                <img className={'w-25'} src={`https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`} alt={ingredient} />
                                <figcaption>
                                    {`${ingredient}: ${details.measure || ''}`}
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
                <Link to={'/'} className="btn btn-primary">Back to Menu</Link>
            </header>
        </div>
    );
};

export default CocktailsDetails;