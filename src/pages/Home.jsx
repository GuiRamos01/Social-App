import Post from "../components/Post";
import "../styles/main.sass"
import "../styles/styles.sass"
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import CookieConsent from "@/components/Cookie";
import ADSComponent from "@/components/ADS";
import Menu from "../components/Menu";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import TextOverflow from "react-text-overflow";
import { Numeral } from "react-numeral";

import DatosPosts from "../scripts/posts.json"
 
const Home = () => {
  const [Posts] = useState(DatosPosts);
  const [LoadingPost, setLoadingPost] = useState(false);

  const { t } = useTranslation();

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  const [Items, setItem] = useState([]);
  
  return (
      <aside id="Home" className="Container">
        <Header/>
        <CookieConsent/>

        <div className="Header headerMenu bg-1 col-1">
          <Link to="/"><div className="Item itemActive">Posts</div></Link>
          <Link to="#"><div className="Item">Vídeos</div></Link>
        </div>

        <div className="Main hm-mtop">
          {LoadingPost &&
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          }

          {Posts === null ? (
            <div className="Recommended w-full">
              <h1 className="title">{t("Recomendados")}</h1>
              {Items.slice(0, 3).map((user) => (
                <div key={user.id} className="w-full">
                  <Link to={`/${user.username}`}>
                    <HoverCard>
                      <HoverCardTrigger>
                        <div className="userItem col-1" key={user.id}>
                          <img src={user.img} alt="" />

                          <div className="Details">
                            <div className="Username">
                              <h1>
                                <TextOverflow text={user.name} />
                              </h1>

                              {(user.verified === 1 || user.verified === 2) && (
                                <svg
                                  className="verified1 w-6 h-6"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}

                              <span className="flex items-center">
                                @<TextOverflow text={user.username} />
                              </span>
                            </div>

                            {user.followersCount === 0 ? (
                              <span className="col-2 followers">0 {t("seguidores")}</span>
                            ) : (
                              <span className="col-2 followers">
                                <Numeral value={user.followersCount} format={"0,0"} /> {t("seguidores")}
                              </span>
                            )}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        {user && user.name ? (
                          <Link to={`/${user.username}`}>
                            <div className="flex">
                              <img src={user.img} className="headerHoverImg" alt="" />

                              <div className="headerHover">
                                <div className="Username">
                                  <TextOverflow text={user.name} />

                                  {user.verified === 1 ? (
                                    <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                  ):("")}
                                </div>

                                <span className="flex items-center">@<TextOverflow text={user.username} /></span>

                                <span className="py-2 text-xs">{user.description}</span>

                                <div className="flex gap-2">
                                  <span><b><Numeral value={user.followersCount || "0"} format={"0a"}/></b> {t("seguidores")}</span>
                                  <span><b><Numeral value={user.followsCount || "0"} format={"0a"}/></b> {t("seguindo")}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ):(
                          <div className="flex justify-center">
                            <Loader2 className="h-5 w-5 col-3 animate-spin" />
                          </div>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  </Link>
                </div>
              ))}
            </div>
          ) : Posts.length > 0 ? (
            Posts.slice(0, visiblePostsCount).map((post) => (
              <Post key={post._id} post={post} />
            ))
          ) : (
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {Posts !== null && visiblePostsCount < Posts.length && (
            <Button variant="outline" className="MoreButton col-3" onClick={loadMorePosts} disabled={loading}>
              {loading ? 
              (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                {t("Ver mais posts")}
              </>)}
            </Button>
          )}

          <ADSComponent/>
        </div>

      <Menu/>
    </aside>
  );
}

export default Home;
