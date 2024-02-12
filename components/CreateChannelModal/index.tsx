import Modal from '@components/Modal';
import React, {FC, useCallback} from "react";
import {Button, Input, Label} from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";
import axios from 'axios';
import workspace from '@layouts/Workspace';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';


interface Props{
    show:boolean;
    onCloseModal:()=>void;
    setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal:FC<Props>=({show,onCloseModal,setShowCreateChannelModal})=>{
    const [newChannel, onChangeNewChannel,setNewChannel] = useInput('');
    const {workspace,channel} = useParams<{workspace:string,channel:string}>();

    const {data:userData,error,mutate}:any = useSWR<IUser | false>("http://localhost:3095/api/users",fetcher,);

    const {data:channelData,mutate:mutateChannel} = useSWR<IChannel[]>(
      userData? `http://localhost:3095/api/workspaces/${workspace}/channels`:null,
      fetcher);


    const onCreateChannel = useCallback((e:any) => {
        e.preventDefault();
         axios.post(
           `http://localhost:3095/api/workspaces/${workspace}/channels`,
           {
               name:newChannel,
           },{
               withCredentials:true,
           }
         ).then((response)=>{
             setShowCreateChannelModal(false);
             mutateChannel();
             setNewChannel('');
         }).catch((error)=>{
             console.dir(error);
             toast.error(error.response?.data,{position:'bottom-center'});
         })
    }, [newChannel]);


    return(
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel}/>
                    {/*Input이 들어가는 경우 컴포넌트를 불리해라,리렌더링 너무 많이 발생함*/}
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
};


export default CreateChannelModal;