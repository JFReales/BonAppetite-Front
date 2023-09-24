import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { filterByRating } from '../../redux/actions/actions'

export const RatingSelector = () => {
	const dispatch = useDispatch()
	const [activeStars, setActiveStars] = useState(Array(5).fill(false))

	const handleStarClick = (stars) => {
		dispatch(filterByRating(stars))
	}

	const handleStarToggle = (index) => {
		const newActiveStars = activeStars.map((_, i) => i <= index)
		setActiveStars(newActiveStars)
		const newRating = newActiveStars.filter((star) => star).length
		handleStarClick(newRating)
	}

	return (
		<RatingSelectorContainer>
			{Array.from({ length: 5 }, (_, index) => (
				<StarIcon
					key={index}
					icon={activeStars[index] ? solidStar : regularStar}
					onClick={() => {
						handleStarToggle(index)
					}}
				/>
			))}
		</RatingSelectorContainer>
	)
}

const RatingSelectorContainer = styled.div`
	width: 100%;
	display: flex;
	gap: 1rem;
	justify-content: center;
	padding: 0.5rem 0;
	font-size: 2rem;

	@media (min-width: 800px) {
		width: fit-content;
	}
`

const StarIcon = styled(FontAwesomeIcon)`
	cursor: pointer;
	transition: all 0.3s ease-in-out;

	&:hover {
		transform: scale(1.2);
	}
`
