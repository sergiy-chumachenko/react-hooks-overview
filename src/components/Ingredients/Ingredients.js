import React, {useCallback, useEffect, useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    useEffect(() => {
        console.log('RENDERING', userIngredients)
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback((filteredIngredients) => {
        setUserIngredients(filteredIngredients);
    }, [setUserIngredients]);

    const addIngredientHandler = ingredient => {
        fetch('https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
                method: "POST",
                body: JSON.stringify(ingredient),
                headers: {'Content-Type': 'application/json'}
            }
        ).then(response => {
            return response.json()
        }).then(data => {
            setUserIngredients(
                (prevState) => [
                    ...prevState,
                    {id: data.name, ...ingredient}
                ]
            );
        });
    }
    const removeIngredientHandler = ingredientId => {
        fetch(`https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
            method: "DELETE",
        }).then(() => {
            setUserIngredients(
                prevState => prevState.filter(ingredient => ingredient.id !== ingredientId)
            );
        });
    }

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
