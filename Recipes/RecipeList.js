import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRecipe, clearSelectedRecipe, editRecipe, selectRecipe, setFilterType, setSearchQuery, toggleFavorite } from './recipesSlice';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex-grow: 1;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.variant === 'primary' ? '#3498db' : '#2ecc71'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#2980b9' : '#27ae60'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #eee;
  transition: all 0.3s ease;
  max-height: ${props => props.show ? '1000px' : '0'};
  overflow: hidden;
  opacity: ${props => props.show ? '1' : '0'};
  margin-top: ${props => props.show ? '20px' : '0'};
`;

const FormTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const RecipeCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background-color: white;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-color: #3498db;
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;

  ${RecipeCard}:hover & {
    transform: scale(1.03);
  }
`;

const RecipeContent = styled.div`
  padding: 20px;
`;

const RecipeTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isFavorite ? '#f1c40f' : '#bdc3c7'};
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  &:hover {
    color: #f1c40f;
    transform: scale(1.1);
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1;

  &:hover {
    background: #3498db;
    color: white;
    transform: scale(1.1);
  }
`;

const RecipeDetail = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  margin-top: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: relative;
  border: 1px solid #eee;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: #c0392b;
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h4`
  color: #3498db;
  margin: 25px 0 15px 0;
  font-size: 18px;
  font-weight: 600;
`;

const List = styled.ul`
  padding-left: 20px;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const AddRecipeButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const RecipeTypeBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${props => 
    props.type === 'breakfast' ? '#f39c12' : 
    props.type === 'lunch' ? '#3498db' : '#9b59b6'};
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 10px;
`;

const RecipeList = () => {
  const dispatch = useDispatch();
  const { all, favorites, filters, selectedRecipe } = useSelector(state => state.recipes);
  const [form, setForm] = useState({ name: '', ingredients: '', steps: '', type: 'breakfast', image: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', ingredients: '', steps: '', type: 'breakfast', image: '' });

  const filteredRecipes = all.filter(recipe => {
    const matchType = filters.type === 'all' || recipe.type === filters.type;
    const matchQuery = recipe.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(filters.query.toLowerCase()));
    return matchType && matchQuery;
  });

  const handleAdd = () => {
    const newRecipe = {
      name: form.name,
      ingredients: form.ingredients.split(',').map(s => s.trim()),
      steps: form.steps.split(',').map(s => s.trim()),
      type: form.type,
      image: form.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
    };
    dispatch(addRecipe(newRecipe));
    setForm({ name: '', ingredients: '', steps: '', type: 'breakfast', image: '' });
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const updatedRecipe = {
      name: editForm.name,
      ingredients: editForm.ingredients.split(',').map(s => s.trim()),
      steps: editForm.steps.split(',').map(s => s.trim()),
      type: editForm.type,
      image: editForm.image,
    };
    dispatch(editRecipe({ id, updatedRecipe }));
    setEditingId(null);
  };

  const renderRecipeDetail = (recipe) => (
    <RecipeDetail>
      <CloseButton onClick={() => dispatch(clearSelectedRecipe())}>
        <span>✕</span> Close
      </CloseButton>
      <h2 style={{ color: '#2c3e50', marginBottom: '5px' }}>{recipe.name}</h2>
      <RecipeTypeBadge type={recipe.type}>
        {recipe.type.charAt(0).toUpperCase() + recipe.type.slice(1)}
      </RecipeTypeBadge>
      <img 
        src={recipe.image} 
        alt={recipe.name} 
        style={{ 
          width: '100%', 
          maxHeight: '400px', 
          objectFit: 'cover', 
          borderRadius: '8px',
          marginTop: '15px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
        }} 
      />
      <SectionTitle>Ingredients</SectionTitle>
      <List>
        {recipe.ingredients.map((ing, i) => <ListItem key={i}>{ing}</ListItem>)}
      </List>
      <SectionTitle>Steps</SectionTitle>
      <ol>
        {recipe.steps.map((step, i) => <ListItem key={i}>{step}</ListItem>)}
      </ol>
    </RecipeDetail>
  );

  return (
    <Container>
      <Header>My Recipe Collection</Header>
      
      <SearchBar>
        <Input
          type="text"
          placeholder="Search by name or ingredient..."
          onChange={e => dispatch(setSearchQuery(e.target.value))}
        />
        <Select onChange={e => dispatch(setFilterType(e.target.value))}>
          <option value="all">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </Select>
      </SearchBar>

      <AddRecipeButtonContainer>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(!showForm)}
          style={{ background: showForm ? '#e74c3c' : '#2ecc71' }}
        >
          {showForm ? '✕ Cancel' : '＋ Add New Recipe'}
        </Button>
      </AddRecipeButtonContainer>

      <FormContainer show={showForm}>
        {showForm && (
          <>
            <FormTitle>Add New Recipe</FormTitle>
            <FormGrid>
              <Input 
                placeholder="Recipe name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
              />
              <Input 
                placeholder="Ingredients (comma separated)" 
                value={form.ingredients} 
                onChange={e => setForm({ ...form, ingredients: e.target.value })} 
              />
              <Input 
                placeholder="Steps (comma separated)" 
                value={form.steps} 
                onChange={e => setForm({ ...form, steps: e.target.value })} 
              />
              <Select 
                value={form.type} 
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </Select>
              <Input 
                placeholder="Image URL (optional)" 
                value={form.image} 
                onChange={e => setForm({ ...form, image: e.target.value })} 
              />
            </FormGrid>
            <Button 
              onClick={handleAdd} 
              disabled={!form.name || !form.ingredients || !form.steps}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Save Recipe
            </Button>
          </>
        )}
      </FormContainer>

      {selectedRecipe && renderRecipeDetail(selectedRecipe)}

      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        {filters.type === 'all' ? 'All Recipes' : `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Recipes`}
      </h2>
      {filteredRecipes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '18px' }}>
          No recipes found. Try adjusting your search or add a new recipe!
        </p>
      ) : (
        <RecipeGrid>
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id}>
              {editingId === recipe.id ? (
                <RecipeContent>
                  <Input 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Recipe name"
                  />
                  <Input 
                    value={editForm.ingredients}
                    onChange={e => setEditForm({...editForm, ingredients: e.target.value})}
                    placeholder="Ingredients (comma separated)"
                  />
                  <Input 
                    value={editForm.steps}
                    onChange={e => setEditForm({...editForm, steps: e.target.value})}
                    placeholder="Steps (comma separated)"
                  />
                  <Select 
                    value={editForm.type}
                    onChange={e => setEditForm({...editForm, type: e.target.value})}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </Select>
                  <Input 
                    value={editForm.image}
                    onChange={e => setEditForm({...editForm, image: e.target.value})}
                    placeholder="Image URL"
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button 
                      onClick={() => handleEdit(recipe.id)}
                      disabled={!editForm.name || !editForm.ingredients || !editForm.steps}
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => setEditingId(null)}
                      variant="primary"
                      style={{ background: '#e74c3c' }}
                    >
                      Cancel
                    </Button>
                  </div>
                </RecipeContent>
              ) : (
                <>
                  <RecipeImage 
                    src={recipe.image} 
                    alt={recipe.name} 
                    onClick={() => dispatch(selectRecipe(recipe))}
                  />
                  <FavoriteButton 
                    isFavorite={favorites.includes(recipe.id)}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      dispatch(toggleFavorite(recipe.id)); 
                    }}
                  >
                    {favorites.includes(recipe.id) ? '★' : '☆'}
                  </FavoriteButton>
                  <EditButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(recipe.id);
                      setEditForm({
                        name: recipe.name,
                        ingredients: recipe.ingredients.join(', '),
                        steps: recipe.steps.join(', '),
                        type: recipe.type,
                        image: recipe.image
                      });
                    }}
                  >
                    ✎
                  </EditButton>
                  <RecipeContent onClick={() => dispatch(selectRecipe(recipe))}>
                    <RecipeTitle>{recipe.name}</RecipeTitle>
                    <RecipeTypeBadge type={recipe.type}>
                      {recipe.type.charAt(0).toUpperCase() + recipe.type.slice(1)}
                    </RecipeTypeBadge>
                  </RecipeContent>
                </>
              )}
            </RecipeCard>
          ))}
        </RecipeGrid>
      )}
    </Container>
  );
};

export default RecipeList;