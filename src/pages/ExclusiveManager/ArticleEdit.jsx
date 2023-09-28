import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { styled } from 'styled-components'
import { CTAsContainer } from '../../components/CTAs/CTAsContainer'
import { Dropdown } from '../../components/Dropdown/StyledDropdown'
import { EditImageButton } from '../../components/EditImage/EditImage'
import { Input } from '../../components/Input/Input'
import { getDishById, getFamilies, updateDish } from '../../redux/actions/actions'
import { Modal } from '../../components/Modal/Modal'

export const ArticleEdit = () => {
	const dispatch = useDispatch()
	const { id } = useParams()
	const [alert, setAlert] = useState(false)
	const [modalInfo, setModalInfo] = useState({
		title: '',
		msg: '',
		isLoader: false,
	})

	useEffect(() => {
		dispatch(getFamilies())
		dispatch(getDishById(id))
	}, [dispatch])

	const allFamilies = useSelector((state) => state.families)
	const families = allFamilies.map((item) => item.class)
	const selectedMenu = useSelector((state) => state.detail)

	const familySelected = allFamilies
		.filter((family) => family.Products.some((producto) => producto.id === Number(id)))
		.map((clase) => clase.class)[0]

	const [articleDetails, setArticleDetails] = useState({
		image: '',
		familyName: '',
		name: '',
		desc: '',
		price: 0,
		time: 0,
		stock: 0,
	})

	useEffect(() => {
		if (selectedMenu) {
			setArticleDetails({
				image: selectedMenu.image,
				familyName: familySelected,
				name: selectedMenu.name,
				desc: selectedMenu.description,
				price: selectedMenu.price,
				time: selectedMenu.time,
				stock: selectedMenu.stock,
			})
		} else {
			console.error('Como e posible ete susesooo...')
		}
	}, [selectedMenu, familySelected])
	const handleImgChange = (newImg) => {
		setArticleDetails((prevArticleDetails) => ({
			...prevArticleDetails,
			image: newImg,
		}))
	}

	const { image, name, desc, price, time, stock, familyName } = articleDetails

	const handleChange = (e) => {
		const { name, value } = e.target
		setArticleDetails((prevArticleDetails) => ({
			...prevArticleDetails,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		console.log(articleDetails)
		if (
			!articleDetails.familyName ||
			!articleDetails.name ||
			!articleDetails.desc ||
			!articleDetails.price ||
			!articleDetails.time ||
			!articleDetails.image ||
			!articleDetails.stock
		) {
			setAlert(true)
			setModalInfo({
				title: 'Campos vacíos',
				msg: 'Por favor revisa todos los campos',
				isLoader: false,
			})
		} else {
			dispatch(updateDish(id, articleDetails))
			setModalInfo({
				title: 'Guardando los datos',
				msg: 'Estamos actualizando la información.',
				isLoader: true,
			})
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 2000)
		}
	}

	return (
		<StyledView>
			{alert && (
				<Modal
					onClose={() => setAlert(false)}
					title={modalInfo.title}
					msg={modalInfo.msg}
					isLoader={modalInfo.isloader}
				/>
			)}
			<StyledForm onSubmit={handleSubmit}>
				<EditImageButton image={image} onImgChange={handleImgChange} />

				<Dropdown
					name="familyName"
					label={'Familia'}
					array={families}
					id={'family'}
					option1={'Selecciona una opción'}
					value={familyName}
					selectedValue={familyName}
					onChange={handleChange}
					helper={'Selecciona la familia a la que pertenece.'}
				/>

				<Input
					type={'text'}
					name={'name'}
					label={'Nombre'}
					value={name}
					onChange={handleChange}
					helper={'Hasta 20 caracteres'}
					isHelperOrError={true}
				/>
				<Input
					type={'text'}
					name={'desc'}
					label={'Descripción'}
					value={desc}
					onChange={handleChange}
					helper={'Hasta 100 caracteres'}
					isHelperOrError={true}
				/>
				<Input type={'number'} name={'price'} label={'Precio'} value={price} onChange={handleChange} />
				<Input
					type={'number'}
					name={'time'}
					label={'Tiempo de preparación'}
					value={time}
					onChange={handleChange}
					helper={'Tiempo en minutos'}
					isHelperOrError={true}
				/>
				<Input
					type={'number'}
					name={'stock'}
					label={'Stock'}
					value={stock}
					onChange={handleChange}
					helper={'Cantidad actual + nuevo stock'}
					isHelperOrError={true}
				/>
				<CTAsContainer type="submit" text1={`Guardar cambios`} />
			</StyledForm>
		</StyledView>
	)
}

const StyledView = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin: auto;
	overflow-y: auto;
	padding: 10vh 4vw 15vh;
	box-sizing: border-box;
	transition: width 0.3s ease-in-out;
	overflow: visible;

	@media (min-width: 650px) {
		width: 30rem;
		padding: 15vh 0;
	}
`

const StyledForm = styled.form`
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: start;
	width: 100%;
	box-sizing: border-box;
	gap: 2.5rem;
`
