import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import { jsx } from '@emotion/react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import {
  AddButton,
  Channels, Chats,
  Header, LogOutButton, MenuScroll,
  ProfileImg, ProfileModal,
  RightMenu, WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { IUser, IWorkspace } from '@typings/db';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';
const Channel =loadable(()=> import('@pages/Channel'));
const DirectMessage =loadable(()=> import('@pages/DirectMessage'));


const Workspace = ({children}:any) =>{
  console.log("Workspace");

  const [showUserMenu,setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal,setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace,onChangeNewWorkspace, setNewWorkspace] = useInput("");
  const [newUrl,onChangeNewUrl, setNewUrl] = useInput("");

  const {data:userData,error,mutate}:any = useSWR<IUser | false>("http://localhost:3095/api/users",fetcher,{
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
  if(!userData){
    return (<Navigate to ="/"></Navigate>)
  }
  const onCloseUserProfile = useCallback((e:any) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);
  const onClickUserProfile = useCallback(()=>{
    setShowUserMenu((prev) => !prev);
  },[])

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  },[]);
  const onCloseModal = useCallback(()=>{
    setShowCreateWorkspaceModal(false);
  },[]);
  const onCreateWorkspace = useCallback((e:any) => {
    e.preventDefault();
    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;
    axios
      .post('http://localhost:3095/api/workspaces', {
      workspace: newWorkspace,
      url: newUrl,
    },{
        withCredentials: true,
      })
      .then(() => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data,{ position: 'bottom-center'});
      });
  }, [newWorkspace, newUrl]);
  return(
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
              <ProfileImg src ={gravatar.url(userData.nickname,{s:'28px',d:'retro'})} alt={userData.nickname}/>
            {showUserMenu && (
              <Menu style={{right:0,top:38}} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src ={gravatar.url(userData.nickname,{s:'36px',d:'retro'})} alt={userData.nickname}/>
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
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
        <Workspaces>
          {userData?.Workspaces?.map((ws:IWorkspace)=>{
            return(
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
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
      <Modal show ={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
            {/*Input이 들어가는 경우 컴포넌트를 불리해라,리렌더링 너무 많이 발생함*/}
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  )
}




export default Workspace;