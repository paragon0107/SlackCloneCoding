import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/styles';

interface Props{
  children:any;
  show:boolean;
  onCloseModal:(e:any)=>void;
  style:CSSProperties;
  closeButton?:boolean;
}
const Menu = ({children,style,show,onCloseModal,closeButton}:Props)=>{

  const stopPropagation = useCallback((e:any)=>{
    e.stopPropagation();
  },[]);

  if(!show){
    return null;
  }
  return(
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>

    </CreateMenu>
  );
};
Menu.defaultProps={
  closeButton:true
}

export default Menu;