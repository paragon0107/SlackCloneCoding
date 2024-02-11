import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, {FC, useCallback, useState, VFC} from 'react';
import useSWR from 'swr';
import { jsx } from '@emotion/react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import {
  AddButton,
  Channels, Chats,
  Header, LogOutButton, MenuScroll,
  ProfileImg, ProfileModal,
  RightMenu, WorkspaceButton, WorkspaceModal,
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
import CreateChannelModal from "@components/CreateChannelModal";
const Channel =loadable(()=> import('@pages/Channel'));
const DirectMessage =loadable(()=> import('@pages/DirectMessage'));


const Workspace = () =>{
  console.log("Workspace");

  const [showUserMenu,setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal,setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace,onChangeNewWorkspace, setNewWorkspace] = useInput("");
  const [newUrl,onChangeNewUrl, setNewUrl] = useInput("");
  const [ showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [ showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const {data:userData,error,mutate}:any = useSWR<IUser | false>("http://localhost:3095/api/users",fetcher,);

  const onLogout = useCallback(()=> {
    axios.post('http://localhost:3095/api/users/logout',null, {
      withCredentials: true,
    })
      .then(()=>{
        mutate(false );
      });
  },[]);
  console.log(userData);
  if(!userData){
    return (<Navigate to ="/"></Navigate>)
  }

  //훅은 리턴 있는 부분 밑에 선언
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
    setShowCreateChannelModal(false);
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
  const toggleWorkspaceModel = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  },[]);
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  },[]);
  return (
      <div>
        <Header>
          <RightMenu>
          <span onClick={onClickUserProfile}>
              <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d: 'retro'})} alt={userData.nickname}/>
            {showUserMenu && (
                <Menu style={{right: 0, top: 38}} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                  <ProfileModal>
                    <img src={gravatar.url(userData.nickname, {s: '36px', d: 'retro'})} alt={userData.nickname}/>
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
            {userData?.Workspaces?.map((ws: IWorkspace) => {
              return (
                  <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                    <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                  </Link>
              );
            })}
            <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
          </Workspaces>
          <Channels>
            <WorkspaceName onClick={toggleWorkspaceModel}>Sleact</WorkspaceName>
            <MenuScroll>
              <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModel} style={{top: 95, left: 80}}>
                <WorkspaceModal>
                  <h2>Sleact</h2>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
            </MenuScroll>
          </Channels>
          <Chats>
            <Routes>
              {/*<Route path="/workspace/:workspace/channel/:channel" Component={Channel}/>*/}
              {/*<Route path="/workspace/:workspace/dm/:id" Component={DirectMessage}/>*/}
            </Routes>
          </Chats>
        </WorkspaceWrapper>
        <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
          <form onSubmit={onCreateWorkspace}>
            <Label id="workspace-label">
              <span>워크스페이스 이름</span>
              <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
              {/*Input이 들어가는 경우 컴포넌트를 불리해라,리렌더링 너무 많이 발생함 예시를 위해 만들어둠*/}
            </Label>
            <Label id="workspace-url-label">
              <span>워크스페이스 url</span>
              <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
            </Label>
            <Button type="submit">생성하기</Button>
          </form>
        </Modal>
        {/*Input이 들어가서 따로 컴포넌트를 빼줌 이러면 유지보수 측면에서도 함수나 상태가 한눈에 보여 편함*/}
        <CreateChannelModal
            show={showCreateChannelModal}
            onCloseModal={onCloseModal}
            setShowCreateChannelModal={setShowCreateChannelModal}
        />
      </div>
  );
}




export default Workspace;