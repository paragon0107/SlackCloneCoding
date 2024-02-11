import Modal from '@components/Modal';
import React, {FC, useCallback} from "react";
import {Button, Input, Label} from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";


interface Props{
    show:boolean;
    onCloseModal:()=>void;
    setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal:FC<Props>=({show,onCloseModal,setShowCreateChannelModal})=>{
    const [newChannel, onChangeNewChannel] = useInput('');
    const onCreateChannel = useCallback(() => {
    }, []);


    return(
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널 이름</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel}/>
                    {/*Input이 들어가는 경우 컴포넌트를 불리해라,리렌더링 너무 많이 발생함*/}
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
};


export default CreateChannelModal;