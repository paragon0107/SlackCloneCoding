import  React from 'react';
import loadable from '@loadable/component'
import { Routes ,Route,Navigate } from 'react-router-dom';

const LogIn=loadable(()=> import('@pages/Login'));
const SignUp =loadable(()=> import('@pages/SignUp'));
const Channel = loadable(()=>import('@pages/Channel'));
const App = () =>{
    return (
    <Routes> //Route 로 되어있는 페이지로 보내준다.
        <Route path='/' element={<Navigate to="/login" />}/> // /인경우에는 그냥 로그인 페이지로
        <Route path = '/login' Component={LogIn}/>
        <Route path = '/signUp' Component={SignUp}/>
        <Route path = '/worlspace/channel' Component={Channel}/>
    </Routes>
    );
}
export default App;
