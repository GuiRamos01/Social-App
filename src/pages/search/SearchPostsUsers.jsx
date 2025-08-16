import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Search.sass"
import Menu from "../../components/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { Loading } from "@/components/loading";

import { Helmet } from "react-helmet";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import ADSComponent from "@/components/ADS";
import DOMPurify from "dompurify";
import Post from "@/components/Post";
import DatosPosts from "../../scripts/posts.json"

const SearchPostsUsers = () => {
  const { t } = useTranslation();
  const { search } = window.location;
  const searchTerm = new URLSearchParams(search).get('q');
  const pathUser = useLocation().pathname.split("/")[1];

  const navigate = useNavigate();

  const [Posts] = useState(DatosPosts);

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const searchText = DOMPurify.sanitize(searchTerm);
  const searchUser = DOMPurify.sanitize(pathUser);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  return (
    <aside id="Search" className="Container">
      <Loading/>

      <Helmet>
        <title>@{searchUser}: {searchText} - Posts Tag / SocialApp</title>
      </Helmet>
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div className="headerPage">
          @{searchUser}: <b>{searchText}</b>
        </div>

        {(
          Posts.slice(0, visiblePostsCount).map((post) => <Post key={post._id} post={post} /> )
        )}

        {visiblePostsCount < Posts.length && (
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

export default SearchPostsUsers;
