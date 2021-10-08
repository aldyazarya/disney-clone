import { gql, GraphQLClient } from 'graphql-request'
import Section from "../components/Section"
import Navbar  from '../components/NavBar'

export const getStaticProps = async () => {

  const url = process.env.ENDPOINT

  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization" : process.env.GRAPH_CMS_TOKEN
    }
  })

  const videosQuery = gql `
    query {
      videos {
        createdAt,
        id,
        title,
        description,
        seen,
        slug,
        tags,
        thumbnail {
          url
        }, 
        mp4 {
          url
        },
      }
    }
  `

  const accountQuerry = gql `
    query {
      account(where: { id: "ckuifthewrl2e09861bicvl1y"}) {
        username
        avatar {
          url
        }
      }
    }
  
  `

  const data = await graphQLClient.request(videosQuery)
  const videos = data.videos

  const accountData = await graphQLClient.request(accountQuerry)
  const account = accountData.account

  return {
    props:{
      videos,
      account
    }
  }

}



const Home = ({ videos, account }) => {
  console.log(videos);


  //  show randm video
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  //  filter video by genre
  const filterVideos = ( videos, genre ) => {
    return videos.filter((video) => video.tags.includes(genre))
  }

  // filter for recomended for you by seen 
  const unSeenVideos = ( videos ) => {
    return videos.filter(video => video.seen == false || video.seen == null)
  }






  return (
    <>
      <Navbar account={account}/>
      <div className="App">
        <div className="main-video">
          <img src={randomVideo(videos).thumbnail.url}
          alt={randomVideo(videos).title}/>
        </div>

        <div className="video-feed">
          <Section genre={"Recommended for you"} videos={unSeenVideos(videos)}/>
          <Section genre={"Adventure"} videos={filterVideos(videos, 'Adventure')}/>
          <Section genre={"Action"} videos={filterVideos(videos, 'Action')}/>
          <Section genre={"Animation"} videos={filterVideos(videos, 'Animation')}/>
          <Section genre={"Drama"} videos={filterVideos(videos, 'Drama')}/>
          <Section genre={"Comedy"} videos={filterVideos(videos, 'Comedy')}/>
          <Section genre={"Sci-Fi"} videos={filterVideos(videos, 'Sci-Fi')}/>
      </div>
      </div>



    </>
  )
}

export default Home;