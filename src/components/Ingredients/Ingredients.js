import React, {useCallback, useEffect, useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('RENDERING', userIngredients)
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback((filteredIngredients) => {
        setUserIngredients(filteredIngredients);
    }, [setUserIngredients]);

    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        fetch('https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
                method: "POST",
                body: JSON.stringify(ingredient),
                headers: {'Content-Type': 'application/json'}
            }
        ).then(response => {
            setIsLoading(false);
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
        setIsLoading(true);
        fetch(`https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
            method: "DELETE",
        }).then(() => {
            setIsLoading(false);
            setUserIngredients(
                prevState => prevState.filter(ingredient => ingredient.id !== ingredientId)
            );
        }).catch(error => {
            setError('Something went wrong!');
        });
    }

    const clearError = () => {
        setError('');
        setIsLoading(false);
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
