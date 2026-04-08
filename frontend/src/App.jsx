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

// LEFT TODO for me(Fatoumata): 
// Maybe add all 3 percentages for arc
// Add a info button
// Implement opinion option on backend
// make more mobile friendly
// Edit loading card to either loading image or more words
// 