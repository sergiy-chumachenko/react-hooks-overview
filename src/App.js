import React, {useContext} from 'react';
import Auth from "./components/Auth";
import {AuthContext} from "./context/auth-context";
import Ingredients from "./components/Ingredients/Ingredients";

const App = () => {
    const authCtx = useContext(AuthContext);
    let content = <Auth/>;
    if (authCtx.isAuth) {
        content = <Ingredients/>;
    }
    return content;
};

export default App;
