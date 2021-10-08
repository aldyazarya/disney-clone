import { gql, GraphQLClient } from "graphql-request";
import Link from "next/link";
import Image from "next/image";
import Section from "../components/Section";
import Navbar from "../components/NavBar";

import disneyLogo from "../public/disney-button.png";
import marvelLogo from "../public/marvel-button.png";
import pixarLogo from "../public/pixar.png";
import natgeoLogo from "../public/natgeo-button.png";
import starwarsLogo from "../public/star-wars-button.png";

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT;

  const graphQLClient = new GraphQLClient(url, {
    headers: {
      Authorization: process.env.GRAPH_CMS_TOKEN,
    },
  });

  const videosQuery = gql`
    query {
      videos {
        createdAt
        id
        title
        description
        seen
        slug
        tags
        thumbnail {
          url
        }
        mp4 {
          url
        }
      }
    }
  `;

  const accountQuerry = gql`
    query {
      account(where: { id: "ckuifthewrl2e09861bicvl1y" }) {
        username
        avatar {
          url
        }
      }
    }
  `;

  const data = await graphQLClient.request(videosQuery);
  const videos = data.videos;

  const accountData = await graphQLClient.request(accountQuerry);
  const account = accountData.account;

  return {
    props: {
      videos,
      account,
    },
  };
};

const Home = ({ videos, account }) => {
  console.log(videos);

  //  show randm video
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  };

  //  filter video by genre
  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre));
  };

  // filter for recomended for you by seen
  const unSeenVideos = (videos) => {
    return videos.filter((video) => video.seen == false || video.seen == null);
  };

  return (
    <>
      <Navbar account={account} />
      <div className="App">
        <div className="main-video">
          <img
            src={randomVideo(videos).thumbnail.url}
            alt={randomVideo(videos).title}
          />
        </div>

        <div className="video-feed">
          <Link href="#disney">
            <div className="franchise" id="disney">
              <Image src={disneyLogo} />
            </div>
          </Link>
          <Link href="#pixar">
            <div className="franchise" id="pixar">
              <Image src={pixarLogo} />
            </div>
          </Link>
          <Link href="#marvel">
            <div className="franchise" id="marvel">
              <Image src={marvelLogo} />
            </div>
          </Link>
          <Link href="#star-wars">
            <div className="franchise" id="star-wars">
              <Image src={starwarsLogo} />
            </div>
          </Link>
          <Link href="#nat-geo">
            <div className="franchise" id="nat-geo">
              <Image src={natgeoLogo} />
            </div>
          </Link>
        </div>

        <Section genre={"Recommended for you"} videos={unSeenVideos(videos)} />
        <Section
          genre={"Adventure"}
          videos={filterVideos(videos, "Adventure")}
        />
        <Section genre={"Action"} videos={filterVideos(videos, "Action")} />
        <Section
          genre={"Animation"}
          videos={filterVideos(videos, "Animation")}
        />
        <Section genre={"Drama"} videos={filterVideos(videos, "Drama")} />
        <Section genre={"Comedy"} videos={filterVideos(videos, "Comedy")} />
        <Section genre={"Sci-Fi"} videos={filterVideos(videos, "Sci-Fi")} />
        <Section
          id="disney"
          genre={"Disney"}
          videos={filterVideos(videos, "Disney")}
        />
        <Section
          id="marvel"
          genre={"Marvel"}
          videos={filterVideos(videos, "Marvel")}
        />
      </div>
    </>
  );
};

export default Home;
