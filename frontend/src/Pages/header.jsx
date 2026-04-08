import { NavLink } from "react-router-dom";
function Header(){
    return(
        <>
        <div class= " text-[50px] flex justify-center m-none text-[#195568] md:p-5" >
            <div class="bungee-regular text-5xl md:text-7xl pt-4 [text-shadow:4px_0px_0px_#7ae1f3]">SureTex</div>
        </div>
        <nav class=" flex bungee-regular text-xl md:text-3xl text-[#692acdb0] bg-[#ffffff80] my-5">
            <NavLink to="/" className={({isActive})=> `block w-1/2 text-center px-4 py-5 ${isActive ? "bg-[#c18fd550]" : ""}`}><div>Verification Analysis</div></NavLink>
            <NavLink to="/game" className={({isActive})=> `block w-1/2 text-center px-4 py-5 ${isActive ? "bg-[#c18fd550]" : ""}`} ><div >Fact Check Game</div></NavLink>
        
        </nav>
        </>
    )
}

export default Header;
          