import React, { useState, useEffect } from 'react'
import { CardContainer } from './styles'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import PokemonCard from '../../components/PokemonCard'
import api from '../../services/api'

function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [pokemonName, setPokemonName] = useState([])
    const [pokemonInfo, setPokemonInfo] = useState([])

    const handleGetPokemonStats = (pokemons) => {
        try {
            pokemons.map((pokemon) =>
                api.get(`/pokemon/${pokemon.name}`).then((response) => {
                    const result = response.data
                    setPokemonInfo((prevState) =>
                        [...prevState, result].sort((a, b) => {
                            return a.id - b.id
                        })
                    )
                })
            )
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }


    const handleGetPokemonName = (
        async () => {
            try {
                setIsLoading(true)

                const response = await api.get('pokemon', {
                    params: {
                        limit: 20,
                    },
                })
                if (response) {
                    setPokemonName(response.data.results)
                    handleGetPokemonStats(response.data.results)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        })


    useEffect(() => {
        handleGetPokemonName()
    }, [])



    return (
        <div>
            <Background />
            <Navbar />
            <CardContainer>

                {
                    isLoading ? 'Loading...' : <></>
                }
                {pokemonInfo && (
                    pokemonName.map((pokemon, index) =>
                        <PokemonCard key={index} code={pokemonInfo[index]?.id} name={pokemon?.name} src={pokemonInfo[index]?.sprites?.other['official-artwork']?.front_default} color={pokemonInfo[index]?.types} />
                    )
                )
                }
            </CardContainer>


        </div>
    )
}

export default Home