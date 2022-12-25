import React, {useCallback, useEffect, useMemo, useReducer} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import IngredientList from "./IngredientList";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ingredient => ingredient.id !== action.id);
        default:
            throw new Error("Should not get there!");
    }
}

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...curHttpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR':
            return {...curHttpState, error: null};
        default:
            throw new Error('Should not be reached!');
    }
}

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
    // const [userIngredients, setUserIngredients] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');

    useEffect(() => {
        console.log(`RENDERING Ingredients`);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback((filteredIngredients) => {
        // setUserIngredients(filteredIngredients);
        dispatch({
            type: 'SET',
            ingredients: filteredIngredients
        });
    }, []);


    const addIngredientHandler = useCallback(ingredient => {
        // setIsLoading(true);
        dispatchHttp({type: 'SEND'});
        fetch('https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
                method: "POST",
                body: JSON.stringify(ingredient),
                headers: {'Content-Type': 'application/json'}
            }
        ).then(response => {
            dispatchHttp({type: 'RESPONSE'});
            return response.json()
        }).then(data => {
            // setUserIngredients(
            //     (prevState) => [
            //         ...prevState,
            //         {id: data.name, ...ingredient}
            //     ]
            // );
            dispatch({
                type: "ADD",
                ingredient: {id: data.name, ...ingredient}
            })
        });
    }, []);
    const removeIngredientHandler = useCallback(ingredientId => {
        // setIsLoading(true);
        dispatchHttp({type: 'SEND'});
        fetch(`https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
            method: "DELETE",
        }).then(() => {
            // setIsLoading(false);
            dispatchHttp({type: 'RESPONSE'});
            // setUserIngredients(
            //     prevState => prevState.filter(ingredient => ingredient.id !== ingredientId)
            // );
            dispatch({
                type: 'DELETE',
                id: ingredientId
            });
        }).catch(() => {
            // setError('Something went wrong!');
            dispatchHttp({type: 'ERROR', errorMessage: "Something went wrong!"});
        });

    }, []);

    const clearError = useCallback(() => {
        dispatchHttp({type: 'CLEAR'});
        // setError('');
        // setIsLoading(false);
    }, []);

    const ingredientList = useMemo(() => {
        return (
            <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
        )
    }, [userIngredients, removeIngredientHandler]);

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
