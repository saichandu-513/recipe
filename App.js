import './App.css';
import RecipeList from './Recipes/RecipeList';
import { store } from './Recipes/store';
import { Provider } from 'react-redux';

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <RecipeList />
      </div>
    </Provider>
  );
}

export default App;
