import styled from "styled-components";
import { Card } from "../Cards/Card";
import { getMenu } from "../../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import translateMenuFromApi from "../../utils/translateMenuFromApi";

export const RecipesList = () => {
  const menuAPI = useSelector((state) => state.filteredMaster);
  const menu = translateMenuFromApi(menuAPI);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);
  return (
    <RecipesContainer>
      {menu.map((family) => (
        <FamiliesContainer key={family.id}>
          <h5 key={family.id}>{family.familyName}</h5>
          <CardsGrid>
            {family.recipes.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                name={card.name}
                img={card.image}
                shortDesc={card.desc}
                time={card.time}
                price={card.price}
                rating={card.rating}
              />
            ))}
          </CardsGrid>
        </FamiliesContainer>
      ))}
    </RecipesContainer>
  );
};

const RecipesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1rem;
`;
const FamiliesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  box-sizing: border-box;
  margin: 1rem 0;
`;

const CardsGrid = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: grid;
  gap: 1rem;
  grid-auto-rows: auto;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
`;
