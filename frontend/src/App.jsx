import './App.css'
import {Outlet} from 'react-router-dom'
import Header from './Pages/header'
function App(){
    return(
    <>
    <Header></Header>
    <Outlet></Outlet>
    </>
    )
}
export default App


//LEFT TODO: 
// Fix the lines on arc
// Maybe add all 3 percentages for arc
