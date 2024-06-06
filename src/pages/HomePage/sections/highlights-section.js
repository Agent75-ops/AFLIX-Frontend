import { useState , useEffect} from "react";
import styled from "styled-components";
import MovieCard from "../../../components/MovieCard/movie-card";

const Container = styled.div`
gap:4rem;
display: flex;
padding: 0 2rem;
flex-direction: column;
align-items: flex-start;
`
const Header = styled.div`
gap:2rem;
width:100%;
display: flex;
align-items: center;
justify-content: space-between;
`
const TextContainer = styled.div`
gap:1rem;
display: flex;
flex-direction: column;
align-items: flex-start;
`
const Title = styled.h2`
margin: 0;
padding: 0;
color:white;
font-weight:bold;
font-size:var(--heading-2);
@media screen and (max-width : 1440px){
    font-size: var(--heading-3);
}
`
const SubTitle = styled.h5`
margin: 0;
padding: 0;
color:#D0D0D0;
font-size:var(--heading-5);
@media screen and (max-width : 1440px){
    font-size: var(--heading-6);
}
`
const StatusButtonsContainer = styled.div`
gap:1rem;
display: flex;
align-items: center;
`
const StatusButton = styled.div`
color:white;
cursor: pointer;
font-weight: bold;
padding: .75rem 1.25rem;
border-radius: 100px;
font-size: var(--body);
background-color: ${({$background})=>$background};
&:hover{
    background-color: var(--main-color);
}
`
const MoviesContainer = styled.div`
gap:2rem;
display: flex;
align-items: center;
`

const TITLE = "Highlights Of The Day";
const STATUS_SUBTITLES = {
    Trending : "~ with great power comes great responsibility",
    Latest : "~ i feel the need... the need for speed !",
    Upcoming : "~ to infinity and beyond !",
}

export default function HighLightsSection(){
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("Latest");


    useEffect(()=>{
        fetchUpcomingLatestTrendingMovies();
    },[selectedStatus])

    function get4MoviesUrl(type){
        return `${process.env.REACT_APP_API_URL}/api/movies/${type.toLowerCase()}/?limit=4`;
    }

    async function fetchMovies(url){
        const request = await fetch(url);
        if (request.status == 200){
            const moviesList = await request.json()
            return moviesList.data.movies;
        }

        return []
    }

    async function fetchUpcomingLatestTrendingMovies(){
        try{
            const [trendingMovies, latestMovies, upcomingMovies] = await Promise.all(
                Object.keys(STATUS_SUBTITLES).map(status => fetchMovies(get4MoviesUrl(status)))
            );

            setMovies({
                trending: trendingMovies,
                latest: latestMovies,
                upcoming: upcomingMovies
            });
           
        }catch (error) {
            setMovies({
                trending: [],
                latest: [],
                upcoming: []
            });
        }

        setIsLoading(false);
    }

    function handleStatusButtonClick(status){
        setSelectedStatus(status);
    }

    return (
        <Container>
            <Header>
                <TextContainer>
                    <Title>{TITLE}</Title>
                    <SubTitle>{STATUS_SUBTITLES[selectedStatus]}</SubTitle>
                </TextContainer>
                <StatusButtonsContainer>
                    {Object.keys(STATUS_SUBTITLES).map(status => (
                        <StatusButton 
                        key={status}
                        $background={status === selectedStatus ? "var(--main-color)" : 'rgba(255,165,0,.6)'} 
                        onClick={()=>handleStatusButtonClick(status)}>{status}</StatusButton>
                    ))}
                </StatusButtonsContainer>
            </Header>
    
            <MoviesContainer>
                {isLoading && Array.from({length:4}).map((_,index) =>(
                    <MovieCard key={index} isLoading={true} />
                ))}
                {!isLoading && movies[selectedStatus.toLowerCase()]?.length > 0 && movies[selectedStatus.toLowerCase()].map((movie)=>(
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </MoviesContainer>
        </Container>
    )
}