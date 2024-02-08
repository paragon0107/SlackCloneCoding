import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import { jsx } from '@emotion/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Channels, Chats,
  Header, LogOutButton, MenuScroll,
  ProfileImg, ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
const Channel =loadable(()=> import('@pages/Channel'));
const DirectMessage =loadable(()=> import('@pages/DirectMessage'));


const Workspace = ({children}:any) =>{
  console.log("Workspace");
  const [showUserMenu,setShowUserMenu] = useState(false);
  const {data,error,mutate}:any = useSWR("http://localhost:3095/api/users",fetcher,{
    dedupingInterval:100000, //100초
  });

  const onLogout = useCallback(()=> {
    axios.post('http://localhost:3095/api/users/logout',null, {
      withCredentials: true,
    })
      .then(()=>{
        mutate(false );
      });
  },[]);
  if(!data){
    console.log("!@#$@@2222222")
    return (<Navigate to ="/"></Navigate>)
  }

  const onClickUserProfile = useCallback(()=>{
    setShowUserMenu((prev) => !prev);
  },[])

  return(
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
              <ProfileImg src ={gravatar.url(data.nickname,{s:'28px',d:'retro'})} alt={data.nickname}/>
            {showUserMenu && (
              <Menu style={{right:0,top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src ={gravatar.url(data.nickname,{s:'36px',d:'retro'})} alt={data.nickname}/>
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
      <Channels>
        <WorkspaceName>Sleact</WorkspaceName>
        <MenuScroll>MenuScroll</MenuScroll>
      </Channels>
      <Chats>
        <Routes>
          <Route path="/workspace/channel" Component={Channel}/>
          <Route path="/workspace/dm" Component={DirectMessage}/>
        </Routes>
      </Chats>
      </WorkspaceWrapper>

    </div>
  )
}




export default Workspace;