import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import MainPage from './Pages/mainPage'
import GamePage from './Pages/gamePage'

const Router=createBrowserRouter([
    {
        path:"/",
        element: <App />,
        children:[
            {
                index: true,
                element: <MainPage />
            },
            {
                path:"/game",
                element: <GamePage />

            }
        ]
    }
])

export default Router;