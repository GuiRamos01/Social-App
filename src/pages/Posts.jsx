import "../styles/main.sass"
import "../styles/styles.sass"
import Menu from "../components/Menu";
import Comment from "../components/Comment";
import "../styles/components/Comment.sass"
import "../styles/pages/Posts.sass"
import DatosPosts from "../scripts/posts.json"
import DatosProfile from "../scripts/user.json"
import DatosComments from "../scripts/comments.json"

import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from 'moment-timezone';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Loading } from "@/components/loading";

import { Player, BigPlayButton, ControlBar, ReplayControl, ForwardControl, VolumeMenuButton, PlayToggle } from 'video-react';
import "video-react/dist/video-react.css"; // import css

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import TextOverflow from "react-text-overflow";
import { Loader2, PencilLine, Pin, PinOff } from "lucide-react";
import axios from "axios";
import { Numeral } from "react-numeral";
import { useSelector } from "react-redux";
import Linkify from 'react-linkify';
import NotFoundPage from "./NotFound";
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import {Quill} from 'react-quill';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import NoDatos from "./NoDatos";
import { Helmet } from "react-helmet";
import Repost from "@/components/Repost";
import PetitionPost from "@/components/PetitionPost";
import ADSComponent from "@/components/ADS";
import { toast } from "sonner";
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";

const Posts = () => {
  const path = useLocation().pathname.split("/")[3];

  const { t } = useTranslation();

  const [post, setPost] = useState([]); 
  const [groups, setGroups] = useState([]);
  const [user] = useState(DatosProfile);
  const [user1] = useState(DatosProfile);
  const [Comments, setComments] = useState(DatosComments);
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);
  const [isBlock, setIsBlock] = useState(true);

  const {currentUser} = useSelector((state) => state.user);

  const navigate = useNavigate();

  const Link1 = Quill.import('formats/link');
  Link1.sanitize = (url) => {
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    return anchor.href;
  };

  const optionsLink = {
    formatHref: {
      hashtag: (href) => "/search/posts?q=%23" + href.substr(1),
      mention: (href) => "/" + href.substr(1)
    },
    target: {
      url: "_blank",
      email: null,
    }
  };

  const [LoadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const foundPost = DatosPosts.find(item => item._id === path);
        setPost(foundPost);
        setNotFound(false);
        setLoadingPost(false)
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          setNotDatos(true);
        }
      }
    };

    if (path) {
      fetchPosts();
    }
  }, [path]);

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const foundComments = DatosComments.find(item => item.postId === path);
  //       setComments(foundComments);
  //     } catch (error) {
  //       console.error("Erro ao buscar:", error);
  //     }
  //   };

  //   if (path) {
  //     fetchComments();
  //   }
  // }, [path]);

  const [repost, setRepost] = useState([]);

  useEffect(() => {
    if (post.repostId) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/posts/id/${post.repostId}`);
          setRepost(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
    }
  });

  const [videoPublish, setVideoPublish] = useState([]);

  useEffect(() => {
    if (post.videoRepost && post.videoRepost[0]) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/posts/video/${post.videoRepost[0]}`);
          setVideoPublish(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
    }
  });

  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [savedPost, setIsSave] = useState(false);
  const [authorPost, setIsAuthorPost] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchComment = async () => {
        try {
          const res = await axios.get(`/api/posts/userActivities/${path}`);
          if (res.data.like === true) {
            setIsLike(true);
          } else {
            setIsLike(false);
          }

          if (res.data.blockedYou === true) {
            setIsBlock(false);
          } else {
            setIsBlock(true);
          }  

          if (res.data.savedPost === true) {
            setIsSave(true);
          } else {
            setIsSave(false);
          }

          if (res.data.authorPost === true) {
            setIsAuthorPost(true);
          } else {
            setIsAuthorPost(false);
          }
        } catch (error) {
          console.error('Erro ao buscar comentário:', error);
        }
      };
      fetchComment();
    }
  }, [currentUser, path]);

  const handleLike = async () => {
      setIsLike(true);
      setLikesCount(likesCount + 1);
  };

  const handleUnlike = async () => {
      setIsLike(false);
      setLikesCount(likesCount - 1);
  }

  const handleSave = async () => {
      setIsSave(true);
      toast(t("Post salvo"))
  };

  const handleSaveRemove = async () => {
      setIsSave(false);
      toast(t("Post removido da lista"))
  }
  
  const [charCount, setCharCount] = useState(0);
  const charLimit = 205;

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit2 = () => {
    setIsSubmitting(true);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift(); // Retorna o valor do cookie
    }
    return null; // Cookie não encontrado
  }
  
  const timezone = getCookie('in_timezone');
  if (!timezone) {
    const defaultTimezone = 'America/Sao_Paulo';
    document.cookie = `in_timezone=${defaultTimezone}; expires=365; path=/`;
  }

  const timezoneDefault = 'America/Sao_Paulo';

  const [date, setDate] = useState('');

  useEffect(() => {
      const formattedDate = moment(post.createdAt).tz(timezone || timezoneDefault).format('DD, MMMM, YYYY HH:mm');
      setDate(formattedDate);
  }, [post.createdAt, timezone]);

  const [dateUpdate, setDateUpdate] = useState('');

  useEffect(() => {
    const formattedDate = moment(post.updatedAt).tz(timezone || timezoneDefault).format('DD, MMMM, YYYY HH:mm');
    setDateUpdate(formattedDate);
  }, [timezone, post.updatedAt]);

  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (post.userId === currentUser._id) {
        setUserLogin(true);
      } else {
        setUserLogin(false);
      }
    }
  }, [currentUser, post]);

  const [petition, setPetition] = useState([]);

  useEffect(() => {
    if (post.petitionId) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/petitions/pub/${post.petitionId}`);
          setPetition(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
    }
  }, [post.petitionId]);

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
    }
  });

  const postText = DOMPurify.sanitize(post.text);
  const textArticle = DOMPurify.sanitize(post.textArticle);

  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const loadMoreComments = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCommentsCount((prevCount) => prevCount + 10);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  const [isTranslate, setIsTranslate] = useState(false);

  const [translatedText, setTranslatedText] = useState('');

  const translateText = async () => {
    try {
      setIsSubmitting(true)
      
      const response = await axios.post('/api/translate', {
        text: postText,
        to: user1.language,
      });

      setIsSubmitting(false)
      setIsTranslate(true)

      setTranslatedText(response.data.translatedText);
    } catch (error) {
      setIsSubmitting(false)
      console.error('Erro ao traduzir texto:', error);
    }
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  if (notDatos) {
    return <NoDatos />;
  }

  return (
    <aside id="Posts" className={post.type === 3 ? ("Container ArticlePost noheaderMenu"):("Container noheaderMenu")}>
      <Loading/>

      {user && user.username && post.type === 1 && (<Helmet>
        <title>{user.name}: {post.text} / SocialApp</title>
      </Helmet>)}

      {user && user.username && post.type === 2 && <Helmet>
        <title>{user.name}: {postText} / SocialApp</title>
      </Helmet>}

      {user && user.username && post.type === 3 && <Helmet>
        <title>{user.name}: {post.titleArticle} / SocialApp</title>
      </Helmet>}

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        {LoadingPost &&
          <div className="loadingPosts py-4 col-3">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        }

        {(post.type === 1 || post.type === 3) && (<>
          <div id="Post" className={post.status === "edited" && ("EditedPost")}>
            <div className="headerPost">  
              <div className="fx-1">      
                <Link to={`/${user.username}`}>
                  <HoverCard>
                    <HoverCardTrigger>
                      <img src={user.img} alt="" />

                      <div className="hpDetails col-1">
                        <div className="Username">
                          <TextOverflow text={user.name} />

                          {user.verified === 1 ? (
                            <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                          ):("")}
                        </div>

                        <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      {user && user.name ? (
                        <Link to={`/${user.username}`}>
                          <div className="flex">
                            <img src={user.img} alt="" />

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

              <DropdownMenu>
                <DropdownMenuTrigger className="col-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {post.status === "on" && userLogin && (
                    <DropdownMenuItem asChild>
                      <Dialog>
                        <DialogTrigger className="buttonDialogDrop rounded-sm focus:bg-accent" asChild>
                          <button className="buttonDrop flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {t("Deletar")}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[505px]">
                            <DialogHeader>
                              <DialogTitle>{t("Deseja mesmo remover este post?")}</DialogTitle>
                              <DialogDescription>
                                {t("Esta ação não poderá ser desfeita.")}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("Deletar")}
                              </Button>
                            </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  )}

                  {currentUser && post.status === "on" && authorPost && (
                    <DropdownMenuItem asChild>
                      <Dialog>
                        <DialogTrigger className="buttonDialogDrop rounded-sm focus:bg-accent" asChild>
                          <button className="buttonDrop flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {t("Deletar")}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[505px]">
                            <DialogHeader>
                              <DialogTitle>{t("Deseja mesmo remover este post?")}</DialogTitle>
                              <DialogDescription>
                                {t("Esta ação não poderá ser desfeita")}.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("Deletar")}
                              </Button>
                            </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  )}

                  {currentUser && post.groupId < 1 &&
                    post.userId === currentUser._id && 
                    post.type === 3 && (
                    <Link to={`/u/editarticle/${post._id}`}>
                      <DropdownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        {t("Editar artigo")}
                      </DropdownMenuItem>
                    </Link>
                  )}

                  {currentUser && post.status === "on" && post.userId === currentUser._id && post.type === 1 && (
                    <Link to={`/u/editpost/${post._id}`}>
                      <DropdownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        {t("Editar texto")}
                      </DropdownMenuItem>
                    </Link>
                  )}

                  {userLogin && post.status === "on" && post.groupId === "0" && (
                    post.postFixed === 1 ? (
                      <DropdownMenuItem>
                        <PinOff className="w-6 h-6" strokeWidth={1.5} />
                        {t("Desfixar post")}
                      </DropdownMenuItem>
                    ):(
                      <DropdownMenuItem>
                        <Pin className="w-6 h-6" strokeWidth={1.5} />
                        {t("Fixar post")}
                      </DropdownMenuItem>
                    )
                  )}

                  {currentUser && post.status === "on" && (savedPost ? (
                      <DropdownMenuItem onClick={handleSaveRemove}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                        </svg>
                        
                        {t("Remover post salvo")}
                      </DropdownMenuItem>
                    ):(
                      <DropdownMenuItem onClick={handleSave}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        {t("Salvar post")}
                      </DropdownMenuItem>
                    )
                  )}

                  <CopyToClipboard text={`https://exemple.com/go/${post.shortLink}`} onCopy={() => toast(t("Link copiado"))}>
                    <DropdownMenuItem>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                      {t("Copiar link")}
                    </DropdownMenuItem>
                  </CopyToClipboard>

                  {currentUser && currentUser._id === post.userId ? (""):(
                    <Link to={`/report/post/${post._id}`}>
                      <DropdownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                        {t("Denunciar")}
                      </DropdownMenuItem>
                    </Link>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {groups.title ? (
              <div className="postGroup col-2">
                <Link to={`/group/${groups._id}`}>{t("Grupo")}: {groups.title}</Link>
              </div>
            ):("")}

            {post.type === 1 && (
              <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                <a href={decoratedHref} key={key} target="_blank"  rel="noopener noreferrer">
                    {decoratedText}
                </a>
                )}>
                  <p className="Expendable">
                    {`${postText}`}
                  </p>
              </Linkify>
            )}

            {(post.type === 1 &&
                <div className="translate">
                  {isTranslate ? (
                    <div>
                      <h1>{t("Traduzido automaticamente")}</h1>

                      <Linkify options={optionsLink} componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer">
                          {decoratedText}
                      </a>
                      )}>
                        <p>{translatedText}</p>
                      </Linkify>
                    </div>
                  ):(
                    <div className="flex items-center">
                      {isSubmitting && <Loader2 className="mr-1 h-4 w-4 col-3 animate-spin" />}
                      <button onClick={translateText} className="translateButton col-3">{t("Traduzir post")}</button>
                    </div>
                  )}
                </div>
            )}

            {post.petitionId && (
              <PetitionPost key={petition._id} post={petition} />
            )}

            {post.repostId && (
              <Repost key={repost._id} post={repost} />
            )}

            {post.type === 3 && (
              <div className="Article">
                <h1>{post.titleArticle}</h1>
                {post.subtitleArticle && <h2 className="col-2">{post.subtitleArticle}</h2>}
                
                {post.photo && post.photo.length > 0 && (
                  <div className="photo-gallery">
                    {post.photo.map((photo, index) => (
                      <div key={index}>
                        <Link to={`photo/${index}`}>
                          <img src={photo} alt={`Photo ${index}`} className="imgPost" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <div className="textArticle2" dangerouslySetInnerHTML={{ __html: textArticle}} />
              </div>
            )}

            {post.video && post.video.length > 0 && (
              <div className="video-gallery">
                {post.video.map((video, index) => (
                  <div key={index} className="videoPost">
                    <Player
                      playsInline
                      src={video}
                      fluid
                      responsive
                      poster={post.videoThumb[index]}
                      style={{ height: '200px', width: 'auto' }}
                    >
                      <BigPlayButton position="center" />
                      <ControlBar autoHide={false}>
                        <VolumeMenuButton vertical />
                        <ReplayControl seconds={5} order={2.1} />
                        <ForwardControl seconds={5} order={3.1} />
                        <PlayToggle />
                      </ControlBar>
                    </Player>

                    {currentUser && (
                      <div className="msgVideo col-3">
                        <Link to={`/newpost/video/${post._id}/${[index]}`}>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            {t("Postar vídeo")}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {post.videoRepost && post.videoRepost.length > 0 && (
              <div className="video-gallery">
                {videoPublish.status === "on" ? (
                  <div key={1} className="videoPost">
                    <Player
                      playsInline
                      src={videoPublish.video}
                      fluid
                      responsive
                      poster={videoPublish.videoThumb}
                      style={{ height: '200px', width: 'auto' }}
                    >
                      <BigPlayButton position="center" />
                      <ControlBar autoHide={false}>
                        <VolumeMenuButton vertical />
                        <ReplayControl seconds={5} order={2.1} />
                        <ForwardControl seconds={5} order={3.1} />
                        <PlayToggle />
                      </ControlBar>
                    </Player>

                    <div className="msgVideo2">
                      <Link to={`/${videoPublish.username}/post/${post._id}`}>
                        <span>
                          {t("por")} <b>@{videoPublish.username}</b>
                          {(videoPublish.userVerified === 1 || videoPublish.userVerified === 2) && (
                            <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </Link>
                    </div>
                  </div>
                ):(
                  <div id="Repost" className="postUn col-2">
                    <p>{t("Vídeo não disponivel")}</p>
                  </div>    
                )}
              </div>
            )}                   

            {post.type === 1 && post.photo && post.photo.length > 0 && (
              <div className="photo-gallery">
                {post.photo.map((photo, index) => (
                  <div key={index}>
                    <Link to={`photo/${index}`}>
                      <img src={photo} alt={`Photo ${index}`} className="imgPost" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="postFooter2 col-2">
              {post.status === "edited" && (
                <Link className="flex" to={`/updates_post/${post.updatePostId}`}>
                  <div className="buttonEdited">
                    <PencilLine className="size-4" strokeWidth={1.8} /> 
                    {t("Veja a versão mais recente deste post")}
                  </div>
                </Link>
              )}

              {post.updatePostId && post.status === "on" && (
                <Link className="flex" to={`/updates_post/${post.updatePostId}`}>
                  <div className="buttonEdited">
                    <PencilLine className="size-4" strokeWidth={1.8} /> 
                    {t("Veja outras versões deste post")}
                  </div>
                </Link>
              )}

              {post && post.updatedAt && <div className="pfDateTime col-2">{t("Editado em")} {dateUpdate}</div>}

              {post && <div className="pfDateTime col-2">{t("Publicado em")} {date}</div>}

              {post.status === "on" && (
                <div className="postFooter">
                  {currentUser ? (
                    isLike ? (
                      <div onClick={handleUnlike} className="pfItem pfItem2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        <Numeral value={post.likesCount} format={"0,0"} />
                      </div>
                    ) : (
                      <div onClick={handleLike} className="pfItem pfItem2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <Numeral value={post.likesCount} format={"0,0"} />
                      </div>
                    )
                  ):(
                    <div onClick={() => navigate(`/auth/login`)} className="pfItem pfItem2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      <Numeral value={post.likesCount} format={"0,0"} />
                    </div>
                  )}

                  {!post.repostId && (currentUser ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="pfItem pfItem2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                          </svg>

                          <Numeral value={post.repostCount} format={"0,0"} />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-50" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <span className="flex gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                              </svg>
                              {t("Repostar")}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/repost?q=${post._id}`)}>
                            <span className="flex gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              {t("Repostar e comentar")}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ):(
                    <div onClick={() => navigate(`/auth/login`)} className="pfItem pfItem2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                      </svg>
                      
                      <Numeral value={post.repostCount} format={"0,0"} />
                    </div>
                  ))}

                  {post.views ? (
                    <div className="pfItem cursorDefault">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <Numeral value={post.views} format={"0,0"}/>
                    </div>
                  ):("")}
                </div>
              )}
            </div>
          </div>

          <div id="Comments">
            <h1 className="title">{t("Comentários")} ({post.commentCount || 0})</h1>

            {currentUser && post && post.status === "on" && isBlock && (
              <div className="NewComment gap-2">
                <div>
                  <img src={user1.img} alt="" />
                </div>

                <div className="inputComment">
                  <Textarea id="comment" placeholder={t("Digite aqui.")} onChange={
                    (e) => setCharCount(e.target.value.length)
                  } maxLength={charLimit}/>

                  <div className="flex gap-2">
                    <div className="detailsInput">
                      <span className="countText colorWhite">{charCount}/{charLimit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isBlock ? (""):(
              <div className="info-alert my-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                {t("msgBlockUserPost")}
              </div>
            )}

            {Comments === null ? (
              <span className="NoItems">{t("Nenhum comentário")}</span>
            ) : Comments.length > 0 ? (
              Comments.slice(0, visibleCommentsCount).map((comment) =>  <Comment key={comment._id} comment={comment}/> )
            ) : (
              <div className="loadingPosts py-4 col-3">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            {Comments !== null && visibleCommentsCount < Comments.length && (
              <Button variant="outline" className="MoreButton col-3" onClick={loadMoreComments} disabled={loading}>
                {loading ? 
                (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                  {t("Ver mais comentários")}
                </>)}
              </Button>
            )}
          </div>
        </>)}

        {post.type === 2 && (
          <div id="Post" className="noBorder">
            <div className="headerPost">  
              <div className="fx-1">      
                <Link to={`/${user.username}`}>
                  <HoverCard>
                    <HoverCardTrigger>
                      <img src={user.img} alt="" />

                      <div className="hpDetails col-1">
                        <div className="Username">
                          <TextOverflow text={user.name} />

                          {user.verified === 1 ? (
                            <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                          ):("")}
                        </div>

                        <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      {user && user.name ? (
                        <Link to={`/${user.username}`}>
                          <div className="flex">
                            <img src={user.img} alt="" />

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

              <DropdownMenu>
                <DropdownMenuTrigger className="col-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                {userLogin ? (
                    <DropdownMenuItem asChild>
                      <Dialog>
                        <DialogTrigger className="buttonDialogDrop rounded-sm focus:bg-accent" asChild>
                          <button className="buttonDrop flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {t("Deletar")}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[505px]">
                            <DialogHeader>
                              <DialogTitle>{t("Deseja mesmo remover este post?")}</DialogTitle>
                              <DialogDescription>
                                {t("Esta ação não poderá ser desfeita.")}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={handleSubmit2} type="submit" variant="destructive" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("Deletar")}
                              </Button>
                            </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  ):("")}

                  {userLogin && post.groupId === "0" && (
                    post.postFixed === 1  ? (
                      <DropdownMenuItem>
                        <PinOff className="w-6 h-6" strokeWidth={1.5} />
                        {t("Desfixar post")}
                      </DropdownMenuItem>
                    ):(
                      <DropdownMenuItem>
                        <Pin className="w-6 h-6" strokeWidth={1.5} />
                        {t("Fixar post")}
                      </DropdownMenuItem>
                    )
                  )}

                  {currentUser && currentUser._id === post.userId ? (""):(
                    <Link to={`/report/post/${post._id}`}>
                      <DropdownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                        {t("Denunciar")}
                      </DropdownMenuItem>
                    </Link>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
              <a href={decoratedHref} key={key} target="_blank" rel="noopener">
                  {decoratedText}
              </a>
              )}>
                <p className="Expendable">
                  {`${postText}`}
                </p>
            </Linkify>

            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              {t("msgVPNservice")}
            </div>

            <iframe 
            className="w-full"
            style={{
              width: "100%",
              overflow: "none",
            }}
            src={`https://rumble.com/embed/${post.liveRumble}/?pub=4`}></iframe>
                                 
            <div className="postFooter2 col-2">
              <div className="pfDateTime col-2">{date}</div>

              <div className="postFooter">
                {currentUser ? (
                  isLike ? (
                    <div onClick={handleUnlike} className="pfItem">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                      <Numeral value={post.likesCount} format={"0,0"} />
                    </div>
                    ):(
                      <div onClick={handleLike} className="pfItem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <Numeral value={post.likesCount} format={"0,0"} />
                      </div>
                  )
                ):(
                  <div className="pfItem">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <Numeral value={post.likesCount} format={"0,0"} />
                  </div>
                )}

                <div className="pfItem cursorDefault">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  {post.views}
                </div>
              </div>
            </div>
          </div>
        )}

        <ADSComponent/>
      </div>

      <Menu/>
    </aside>
  );
}

export default Posts;
