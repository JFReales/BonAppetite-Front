import { faDollar, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  faClock,
  faEdit,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { StyledInput } from "../Input/StyledInput";
import { Dropdown } from "../Dropdown/StyledDropdown";
import { CircleButton } from "../CircleButton/CircleButton";
import { TextButton } from "../TextButton/TextButton";
import { CTAsContainer } from "../CTAs/CTAsContainer";
import formatDataArticlesTable from "../../utils/formatDataArticlesTable";
import { EditImageButton } from "../EditImage/EditImage";
import { Modal } from "../Modal/Modal";
import { getMenu } from "../../utils/getMenu";
import axios from "axios";

export const ArticlesTable = () => {
  const [data, setData] = useState([]);
  const [menu, setMenu] = useState([]);
  const [numberItemsInDB, setNumber] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Intenta obtener los datos del localStorage
        const localData =
          JSON.parse(localStorage.getItem("dataDashboard")) || [];

        const menuData = await getMenu();
        setMenu(menuData);
        const formattedData = menuData.flatMap(formatDataArticlesTable);
        setNumber(formattedData.length);
        setData([...formattedData, ...localData]);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const families = menu.map((item) => item.familyName);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);

  const handleDelete = (index) => {
    setIsDeleteModalVisible(true);

    setItemToDeleteIndex(index);
  };

  //   const handleEdit = (index) => {
  //     const updatedData = [...data];
  //     updatedData[index].isEditable = !updatedData[index].isEditable;
  //     setData(updatedData);
  //   };

  const handleConfirmDelete = () => {
    if (itemToDeleteIndex !== null) {
      const newData = [...data];
      newData.splice(itemToDeleteIndex, 1);
      setData(newData);

      setIsDeleteModalVisible(false);

      setItemToDeleteIndex(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);

    setItemToDeleteIndex(null);
  };

  const addRow = () => {
    const newItem = {
      image: "",
      family: "",
      name: "",
      price: 0,
      time: 0,
      desc: "",
      isEditable: true,
    };

    // Agrega el nuevo elemento al estado local
    setData([...data, newItem]);

    // Obtiene los datos existentes del localStorage (si los hay)
    const storedData = JSON.parse(localStorage.getItem("dataDashboard")) || [];

    // Guarda el nuevo elemento en el localStorage
    localStorage.setItem(
      "dataDashboard",
      JSON.stringify([...storedData, newItem])
    );
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newData = [...data];
    const newDataStorage =
      JSON.parse(localStorage.getItem("dataDashboard")) || [];
    newData[index] = {
      ...newData[index],
      [name]: value,
    };
    newDataStorage[index - numberItemsInDB] = {
      ...newDataStorage[index - numberItemsInDB],
      [name]: value,
    };
    localStorage.setItem("dataDashboard", JSON.stringify(newDataStorage));
    setData(newData);
  };

  const handleImgChange = (newImg, index) => {
    setData((prevData) => {
      const newData = [...prevData];
      const updatedItem = { ...newData[index], image: newImg };
      newData[index] = updatedItem;
      const prevStorage =
        JSON.parse(localStorage.getItem("dataDashboard")) || [];
      const lenghtDataDB = newData.length - prevStorage.length;
      const indexStorage = index >= lenghtDataDB ? index - lenghtDataDB : index;
      const newDataStorage = [...prevStorage];
      const updatedItemStorage = {
        ...newDataStorage[indexStorage],
        image: newImg,
      };
      newDataStorage[indexStorage] = updatedItemStorage;
      // Guardar en el localStorage
      localStorage.setItem("dataDashboard", JSON.stringify(newDataStorage));
      console.log(newDataStorage);

      return newData;
    });
  };
  // Función para hacer un POST con Axios
  /*   const enviarProducto = (producto) => {
    return axios.post("https://resto-p4fa.onrender.com/product", producto);
  }; */
  const handleSubmit = async () => {
    const editableItems = data.filter((item) => item.isEditable);
    console.log(editableItems);
    localStorage.setItem("dataDashboard", JSON.stringify([]));
    /*     // Usamos Promise.all() para enviar todas las peticiones en paralelo
    Promise.all(editableItems.map(enviarProducto))
      .then((respuestas) => {
        console.log("Todas las peticiones se han completado:", respuestas);
      })
      .catch((error) => {
        console.error("Al menos una petición fue rechazada:", error);
      }); */
  };

  return (
    <TableContainer>
      <div>
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Familia</th>
              <th>Nombre</th>
              <th>
                <FontAwesomeIcon icon={faDollar} />
              </th>
              <th>
                <FontAwesomeIcon icon={faClock} />
              </th>
              <th>Descripción</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {console.log(data)}
            {data.map((row, index) => (
              <StyledRow key={index}>
                <TableCell1>
                  {row.isEditable ? (
                    <EditImageButton
                      img={row.image}
                      onImgChange={handleImgChange}
                      index={index}
                    />
                  ) : (
                    <StyledImg src={row.image} />
                  )}
                </TableCell1>
                <TableCell2>
                  {row.isEditable ? (
                    <TableDropdown
                      array={families}
                      selectedValue={row.family}
                      name={"family"}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    <RowContent>{row.family}</RowContent>
                  )}
                </TableCell2>
                <TableCell3>
                  {row.isEditable ? (
                    <TableInput
                      type="text"
                      name="name"
                      value={row.name}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    <RowContent>{row.name}</RowContent>
                  )}
                </TableCell3>
                <TableCell4>
                  {row.isEditable ? (
                    <TableInput
                      type="number"
                      name="price"
                      value={row.price}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    <RowContent>{row.price}</RowContent>
                  )}
                </TableCell4>
                <TableCell5>
                  {row.isEditable ? (
                    <TableInput
                      type="number"
                      name="time"
                      value={row.time}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    <RowContent>{row.time}</RowContent>
                  )}
                </TableCell5>
                <TableCell6>
                  {row.isEditable ? (
                    <TableInput
                      type="text"
                      name="desc"
                      value={row.desc}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    <RowContent>{row.desc}</RowContent>
                  )}
                </TableCell6>
                {/* <TableCell7>
									<CircleButton isActive={row.isEditable} icon={faEdit} onClick={() => handleEdit(index)} />
								</TableCell7> */}
                <TableCell7>
                  <CircleButton
                    icon={faTrashCan}
                    onClick={() => handleDelete(index)}
                  />
                </TableCell7>
              </StyledRow>
            ))}
          </tbody>
        </table>
        <TextButton onClick={addRow} text={"Agregar fila"} />
      </div>
      <CTAsContainer
        className={"small"}
        text1={"Cargar info"}
        onClick1={handleSubmit}
      />
      {isDeleteModalVisible && (
        <Modal
          onClose={handleCancelDelete}
          title={"Borrar artículo"}
          msg={"Ten en cuenta que no podrás recuperarlo."}
          text1={"Borrar"}
          onClick1={handleConfirmDelete}
          text2={"Cancelar"}
          onClick2={handleCancelDelete}
        />
      )}
    </TableContainer>
  );
};

const TableContainer = styled.div`
  margin: 5rem 0;

  height: auto;
  display: flex;
  gap: 10rem;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-end;
`;

const StyledRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableCell1 = styled.td`
  padding: 0.5rem 1rem;
  width: 6.75rem;
  box-sizing: border-box;
`;

const TableCell2 = styled.td`
  padding: 0.5rem 1rem;
  width: 10rem;
  box-sizing: border-box;
`;

const TableCell3 = styled.td`
  padding: 0.5rem 1rem;
  width: 10rem;
  box-sizing: border-box;
`;

const TableCell4 = styled.td`
  padding: 0.5rem 1rem;
  width: 6rem;
  box-sizing: border-box;
`;

const TableCell5 = styled.td`
  padding: 0.5rem 1rem;
  width: 6rem;
  box-sizing: border-box;
`;

const TableCell6 = styled.td`
  padding: 0.5rem 1rem;
  width: 30rem;
  box-sizing: border-box;
`;

const TableCell7 = styled.td`
  padding: 0.5rem 1rem;
  width: 2rem;
  box-sizing: border-box;
`;

const StyledImg = styled.img`
  width: 6rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const TableDropdown = styled(Dropdown)`
  display: flex;
  width: 10rem;
  height: 2rem;
  padding: var(--Qty, 0rem) 1.5rem;
  justify-content: space-between;
  align-items: center;

  && select {
    width: 10rem;
    height: 2rem;
  }
`;

const TableInput = styled(StyledInput)`
  min-width: 0;
  width: 100%;
  height: 4rem;
  box-sizing: border-box;

  & input {
    min-width: 0;
  }
`;

const RowContent = styled.span`
  font-size: 1rem;
  width: 100%;
  display: flex;
  padding-left: 1rem;
`;
