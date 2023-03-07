import React, { useState, useEffect } from 'react'
import { CardContainer, HomeContainer } from './styles'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import PokemonCard from '../../components/PokemonCard'
import api from '../../services/api'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '../../components/Loading'

function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [pokemonName, setPokemonName] = useState([])
    const [pokemonInfo, setPokemonInfo] = useState([])
    const pokemonLimit = 20
    const [pokemonOffSet, setPokemonOffSet] = useState(pokemonLimit)

    const handleGetPokemonName = (
        async () => {
            try {
                setIsLoading(true)

                const response = await api.get('pokemon', {
                    params: {
                        limit: pokemonLimit,
                    },
                })
                if (response) {
                    setPokemonName(response.data.results)
                    handleGetPokemonStats(response.data.results)
                }
            } catch (error) {
                console.log(error)
            }
        })

    const handleGetPokemonStats = (pokemons) => {
        try {
            pokemons.map((pokemon) =>
                api.get(`/pokemon/${pokemon.name}`)
                    .then((response) => {
                        const result = response.data
                        setPokemonInfo((prevState) =>

                            [...prevState, result].sort((a, b) => {
                                return a.id - b.yaid
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


    async function handleLoadNewPokemons() {
        try {
            setIsLoading(true)
            const response = await api.get('pokemon', {
                params: {
                    limit: pokemonLimit,
                    offset: pokemonOffSet
                }
            })
            if (response) {
                setPokemonName((prevState) => [...prevState, ...response.data.results])
                handleGetPokemonStats(response.data.results)
                setPokemonOffSet((prevState) => prevState + pokemonLimit)
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        handleGetPokemonName()

    }, [])



    return (
        <div>

            <InfiniteScroll
                dataLength={pokemonInfo.length}
                next={handleLoadNewPokemons}
                hasMore={isLoading ? false : true}
                scrollThreshold={0.9}
                style={{ overflow: 'hidden' }}
            >
                <Background />
                <HomeContainer>
                    <Navbar />
                    <CardContainer>

                        {
                            isLoading ? <Loading /> : <></>
                        }
                        {pokemonInfo && (
                            pokemonName.map((pokemon, index) =>
                                <PokemonCard key={index} code={pokemonInfo[index]?.id} name={pokemon?.name} src={pokemonInfo[index]?.sprites?.other['official-artwork']?.front_default} color={pokemonInfo[index]?.types} />
                            )
                        )
                        }
                    </CardContainer>
                </HomeContainer>
            </InfiniteScroll>


        </div>
    )
}

export default Home
