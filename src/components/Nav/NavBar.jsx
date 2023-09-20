/* eslint-disable react/prop-types */
import {
  faArrowLeft,
  faBasketShopping,
  faEllipsisVertical,
  faList,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { Logo } from "../../assets/images/Logo/Logo";
import { CircleButton } from "../CircleButton/CircleButton";
import { TextButton } from "../TextButton/TextButton";
import { useDispatch, useSelector } from "react-redux";
import { addUrl, logged, addUserLogged } from "../../redux/actions/actions";
import useAutoSignin from "../../utils/useAutoSignin";

export const NavBar = ({ themeToggler, currentTheme }) => {
  //Este hook inicia sesión si existe un token o no y guarda el usuario y pone true el estado
  //////////////////////////////////////////
  const authCompleted = useAutoSignin();
  /////////////////////////
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const log = useSelector((state) => state.logged);
  const dispatch = useDispatch();
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const location = useLocation().pathname;

  const isHome = location === "/customer/" || location === "/manager/";
  const isBasket = location.includes("basket");
  const isOrders = location === "/manager/orders/";
  const isReview = location === "/review/";
  const isKitchen = location === "/kitchenView/";

  const isManagerView = location.startsWith("/manager/");

  const login = () => {
    dispatch(addUrl(location));
  };
  const logout = () => {
    dispatch(logged(false));
    dispatch(
      addUserLogged({
        id: "",
        email: "",
        role: "",
        name: "",
      })
    );
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 650) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <StyledNavBarContainer $isOpen={isMenuOpen}>
      {isReview ? (
        <Logo />
      ) : (
        <>
          <MenuButton>
            <NavLink
              to={!isHome ? (isManagerView ? "/manager/" : "/customer/") : null}
            >
              <CircleButton
                icon={!isHome ? faArrowLeft : faEllipsisVertical}
                className={` ${isMenuOpen ? "active" : ""}`}
                onClick={isHome ? () => setIsMenuOpen(!isMenuOpen) : null}
              />
            </NavLink>
          </MenuButton>

          <NavLink to={isManagerView ? "/manager/" : "/customer/"}>
            <Logo onClick={closeMenu} />
          </NavLink>

          <RightButton>
            {isManagerView ? (
              <NavLink to="/manager/orders/">
                <CircleButton
                  isActive={isOrders}
                  icon={faList}
                  onClick={closeMenu}
                />
              </NavLink>
            ) : (
              <NavLink to="/customer/basket/">
                <CircleButton
                  isActive={isBasket}
                  icon={faBasketShopping}
                  onClick={closeMenu}
                />
              </NavLink>
            )}
          </RightButton>

          <NavLinks $isOpen={isMenuOpen}>
            {!isKitchen && (
              <NavLink
                to={
                  isManagerView
                    ? "/manager/orders/"
                    : "customer/orders/:referrer"
                }
              >
                <TextButton text={"Ver órdenes"} onClick={closeMenu} />
              </NavLink>
            )}
            {isManagerView && (
              <NavLink to="/manager/families">
                <TextButton text={"Editar familias"} onClick={closeMenu} />
              </NavLink>
            )}
            {!isKitchen && (
              <NavLink to={log ? "/" : "customer/login"}>
                {authCompleted ? (
                  !log ? (
                    <TextButton
                      text={"Iniciar Sesion"}
                      onClick={() => {
                        closeMenu();
                        login();
                      }}
                    />
                  ) : (
                    <TextButton
                      text={"Cerrar sesión"}
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                    />
                  )
                ) : (
                  <TextButton text={"Cargando..."} />
                )}
              </NavLink>
            )}

            {!isManagerView && !isMenuOpen && !isKitchen && (
              <NavLink to="/customer/basket">
                <CircleButton
                  isActive={isBasket}
                  icon={faBasketShopping}
                  onClick={closeMenu}
                />
              </NavLink>
            )}
            <CircleButton
              className={` ${
                currentTheme === "dark" ? "dark-theme" : "light-theme"
              }`}
              onClick={() => {
                themeToggler();
                closeMenu();
              }}
              icon={currentTheme === "dark" ? faSun : faMoon}
            ></CircleButton>
          </NavLinks>
        </>
      )}
    </StyledNavBarContainer>
  );
};

const StyledNavBarContainer = styled.nav`
  display: flex;
  width: 100%;
  height: 4rem;
  box-sizing: border-box;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  border-radius: 0rem 0rem 2rem 2rem;
  background: ${(props) => props.theme.primary};
  box-shadow: ${(props) => props.theme.largeShadow};

  ${(props) =>
    props.$isOpen &&
    `
  
  height: auto;

  `}

  a {
    text-decoration: none;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: space-between;
    padding-top: 1rem;
  }
`;

const NavLinks = styled.div`
  pointer-events: all;
  opacity: 1;
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 800px) {
    padding: 2rem 0 1rem 0;
    gap: 1rem;
    pointer-events: none;
    opacity: 0;
    flex-direction: column;
  }

  ${(props) =>
    props.$isOpen &&
    `
    opacity: 1 !important;
    pointer-events: all !important;
    
  `}
`;

const MenuButton = styled.div`
  display: none;
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;

  @media (max-width: 800px) {
    display: flex;
  }
`;

const RightButton = styled.div`
  margin-left: auto;
  margin: 0 1rem 0 auto;
  display: none;

  @media (max-width: 800px) {
    margin: 0;
    position: absolute;
    right: 1.25rem;
    top: 1.25rem;
    display: flex;
  }
`;
