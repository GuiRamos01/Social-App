import { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoadingBar from 'react-top-loading-bar';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';

import './App.css';
import './index.css';

import { ThemeProvider } from '@/components/theme-provider';

import Home from './pages/Home';
import Post from './pages/Posts';
import Profile from './pages/Profile';
import NewPost from './pages/newpost/NewPost';
import More from './pages/More';
import EditProfile from './pages/EditProfile';
import CompleteRegister from './pages/auth/CompleteRegister';
import LoginEmail from './pages/auth/LoginEmail';
import ResetPassword from './pages/auth/ResetPassword';
import NewPassword from './pages/auth/NewPassword';
import NewEmail from './pages/auth/NewEmail';
import Login from './pages/auth/Login';
import Photo from './pages/Photo';
// import Search from './pages/search/Search';
// import SearchProfile from './pages/search/SearchProfile';
// import SearchPosts from './pages/search/SearchPosts';
// import Group from './pages/Group';
// import ProfileGroups from './pages/ProfileGroups';
// import CreateGroup from './pages/CreateGroup';
// import Notifications from './pages/Notifications';
import NotFoundPage from './pages/NotFound';
// import DeletedUser from './pages/auth/DeletedUser';

import Comments from './pages/Comments';
// import GroupMembers from './pages/GroupMembers';
// import SearchGroupsProfile from './pages/search/SearchGroupProfile';
// import GroupsFollowing from './pages/GroupsFollowing';
import Signup from './pages/auth/Signup';
import ConfirmEmail from './pages/auth/ConfirmEmail';
// import TwoFAEmail from './pages/auth/2fa/2FAEmail';
// import TwoFA from './pages/auth/2fa/2FA';
import Petition from './pages/Petition';
import SavedPosts from './pages/SavedPosts';
import ChangeLanguage from './pages/ChangeLanguage';
import SearchPostsUsers from './pages/search/SearchPostsUsers';
// import Followers from './pages/Followers';
// import Following from './pages/Following';
// import TwoFADevice from './pages/auth/2fa/2FADevice';

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
}

function AppContent() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Helmet>
          <title>SocialApp</title>
        </Helmet>

        <BrowserRouter>
          <LoadingBar color='#395FEA' progress={100} height='4px' />

          <Wrapper>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/:userId/post/:id' element={<Post />} />
              <Route path='/:userId/followers' element={<Navigate replace to="/auth/login" />} />
              <Route path='/:userId/following' element={<Navigate replace to="/auth/login" />} />

              <Route path='comment/:id' element={<Comments />} />
              <Route path='savedposts' element={currentUser ? <SavedPosts /> : <Navigate replace to="/auth/login?redirect=u/savedposts" />} />

              {/* <Route path='notifications' element={currentUser ? <Notifications /> : <Navigate replace to="/auth/login?redirect=notifications" />} /> */}
              <Route path='*' element={<NotFoundPage />} />

              <Route path='/:id' element={<Profile />} />
              {/* <Route path='/:id/groups' element={<ProfileGroups />} /> */}
              <Route path='/:id/posts-tag' element={<SearchPostsUsers/>} />

              {/* <Route path='group/:id' element={<Group />} /> */}

              {/* <Route path='newgroup' element={currentUser ? <CreateGroup /> : <Navigate replace to="/auth/login?redirect=newgroup" />} /> */}

              <Route path='more' element={<More />} />

              <Route path='/u'>
                {/* <Route path='followedgroups' element={currentUser ? <GroupsFollowing /> : <Navigate replace to="/auth/login?redirect=u/followedgroups" />} /> */}
                <Route path='editprofile' element={currentUser ? <EditProfile /> : <Navigate replace to="/auth/login?redirect=u/editprofile" />} />
              </Route>

              <Route path='/:userId/post/:id/photo/:id' element={<Photo />} />

              <Route path='/i/lang' element={<ChangeLanguage />} />

              {/* <Route path='search' element={currentUser ? <Search /> : <Navigate replace to="/auth/login?redirect=search" />} />
              <Route path='search/users' element={currentUser ? <SearchProfile /> : <Navigate replace to="/auth/login?redirect=search" />} />
              <Route path='search/posts' element={currentUser ? <SearchPosts /> : <Navigate replace to="/auth/login?redirect=search" />} /> */}

              {/* <Route path='group/members/:id' element={<GroupMembers />} />
              <Route path='group/members/:id/search' element={<SearchGroupsProfile />} /> */}

              <Route path='/newpost'>
                <Route path='' element={<NewPost />} />
              </Route>

              <Route path='petition/:id' element={<Petition />} />

              <Route path='/auth'>
                <Route path='login' element={currentUser ? <Navigate replace to="/" /> : <Login />} />
                <Route path='signup' element={<Signup />} />
                <Route path='complete-register' element={currentUser ? <CompleteRegister /> : <Navigate replace to="/" />} />
                <Route path='login-email' element={ <LoginEmail />} />
                <Route path='reset-password' element={currentUser ? <Navigate replace to="/" /> : <ResetPassword />} />
                <Route path='new-password/:id' element={<NewPassword />} />
                <Route path='new-email/:id' element={<NewEmail />} />
                {/* <Route path='2fa' element={currentUser ? <Navigate replace to="/" /> : <TwoFA />} /> */}
                {/* <Route path='2fa-email/:id' element={currentUser ? <Navigate replace to="/" /> : <TwoFAEmail />} />
                <Route path='2fa-device/:id' element={currentUser ? <Navigate replace to="/" /> : <TwoFADevice />} /> */}
              </Route>

              {/* <Route path='deleted-user/:id' element={<DeletedUser />} /> */}
              <Route path='confirm-email/:id' element={<ConfirmEmail />} />
            </Routes>
          </Wrapper>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
