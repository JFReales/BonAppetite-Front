import { styled } from "styled-components";
import { CTAsContainer } from "../../components/CTAs/CTAsContainer";
import { menu } from "../../assets/mockedMenu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// const articleDetails = {
//     img: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
//     name: "Tacos de perro",
//     desc: "Deliciosos tacos de carne de perro",
//     price: 90
// }

const dishes = [];
for (const family of menu) {
  for (const recipe of family.recipes) {
    dishes.push(recipe);
  }
}

console.log(dishes)



export const DetailPage = () => {

    const { id } = useParams();
    const [articleDetails, setArticleDetails] = useState({
      image: '',
      name:'',
      desc:'',
      price:0,
    }); 
  
    useEffect(() => {
      
      const selectedMenu = dishes.find(item => item.id === Number(id))
      if(selectedMenu) {
        setArticleDetails({
          img: selectedMenu.image,
          name: selectedMenu.name,
          desc: selectedMenu.desc,
          price: selectedMenu.price,
        })

      } else{
        console.error('Como e posible ete susesooo...')
      }
      // console.log(selectedMenu)

    //   axios
    //     .get(`articles/${id}`)
    //     .then((response) => {
    //       setArticleDetails(response.data); 
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    }, [id]);

const {img, name, desc, price} = articleDetails;

  return (
    <StyledView>
      <StyledImg src={img}/>
      <h6>{name}</h6>
      <p>{desc}</p>
      <h6>${price}</h6>
      <CTAsContainer text1={`Agregar · $${price}`}/>
    </StyledView>
  );
};

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin: auto;
  padding: 5rem 1rem;
  box-sizing: border-box;
  gap: 2.5rem;
  transition: width 0.3s ease-in-out;

  @media (min-width: 650px) {
    width: 30rem;
  }
`;

const StyledImg = styled.img`
  height: 15rem;
  width: 100%;
  border-radius: 0.5rem;
  object-fit: cover;
  box-sizing: border-box;
`;
