import React, {useEffect, useRef, useState} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (enteredFilter === inputRef.current.value) {
                const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                fetch('https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query)
                    .then(response => response.json())
                    .then(data => {
                        const loadedIngredients = [];
                        for (const key in data) {
                            loadedIngredients.push({
                                id: key,
                                title: data[key].title,
                                amount: data[key].amount
                            });
                        }
                        onLoadIngredients(loadedIngredients);
                    })
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [enteredFilter, onLoadIngredients, inputRef])


    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input ref={inputRef}
                           onChange={event => setEnteredFilter(event.target.value)}
                           type="text"/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
