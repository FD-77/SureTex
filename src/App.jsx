import './App.css'
import { useState, useEffect, use } from 'react';
import { FaCircle } from "react-icons/fa6";

function App(){
    const [wordCount, setCount]=useState(0)
    const [text, setText]=useState(null)
    const [vPercent, setvPercent]=useState(["--","--"])
    const [rPercent, setrPercent]=useState(["--","--"])
    const [neiPercent, setneiPercent]=useState(["--","--"])
    const [loading, setLoading]=useState(false)
    const [completed, setCompletion]=useState(false)
    const [model, setModel]= useState("roberta")
    const [verifiable, setVerifiable]=useState("--")
    const [refutes, setRefutes]=useState("--")
    const [notEI, setnotEI]=useState("--")
    const [testedText, setTestedText]=useState(["map1", "map2"])
    const [percent, setPercent]=useState([12, 25])

    useEffect(() => {
        if (model==="roberta"){
            setVerifiable(vPercent[0]);
            setRefutes(rPercent[0]);
            setnotEI(neiPercent[0]);
        }
        else{
            setVerifiable(vPercent[1]);
            setRefutes(rPercent[1]);
            setnotEI(neiPercent[1]);
        }
    }, [model, vPercent])

    const labeledSentences = [
        {sentence: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", label: "REFUTES"},
        {sentence: "Curabitur mi ipsum, auctor ac posuere sit amet, mattis nec sapien.", label: "SUPPORTS"},
        {sentence: "Suspendisse pulvinar venenatis dolor eu iaculis.", label: "NOT ENOUGH INFO"},
        {sentence: "Maecenas rhoncus, sem ac suscipit vulputate, ipsum ex dictum elit, sit amet aliquam quam nulla vitae ante.", label: "SUPPORTS"},
        {sentence: "Aliquam luctus, turpis vitae fringilla lacinia, nisi lorem congue nunc, non venenatis turpis ante vitae ex.", label: "REFUTES"},
        {sentence: "Maecenas in leo ipsum.", label: "NOT ENOUGH INFO"},
        {sentence: "Nulla at libero ac lacus consectetur vehicula.", label: "SUPPORTS"},
        {sentence: "Phasellus convallis sollicitudin ligula nec ornare.", label: "REFUTES"},
        {sentence: "Ut consequat elit massa, id egestas metus suscipit eu.", label: "NOT ENOUGH INFO"},
        {sentence: "Mauris vestibulum pharetra lectus vel venenatis.", label: "SUPPORTS"},
        {sentence: "Nam erat ante, cursus et justo ut, vulputate commodo neque.", label: "REFUTES"},
        {sentence: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", label: "REFUTES"},
        {sentence: "Curabitur mi ipsum, auctor ac posuere sit amet, mattis nec sapien.", label: "SUPPORTS"},
        {sentence: "Suspendisse pulvinar venenatis dolor eu iaculis.", label: "NOT ENOUGH INFO"},
        {sentence: "Maecenas rhoncus, sem ac suscipit vulputate, ipsum ex dictum elit, sit amet aliquam quam nulla vitae ante.", label: "SUPPORTS"},
        {sentence: "Aliquam luctus, turpis vitae fringilla lacinia, nisi lorem congue nunc, non venenatis turpis ante vitae ex.", label: "REFUTES"},
        {sentence: "Maecenas in leo ipsum.", label: "NOT ENOUGH INFO"},
        {sentence: "Nulla at libero ac lacus consectetur vehicula.", label: "SUPPORTS"},
        {sentence: "Phasellus convallis sollicitudin ligula nec ornare.", label: "REFUTES"},
        {sentence: "Ut consequat elit massa, id egestas metus suscipit eu.", label: "NOT ENOUGH INFO"},
        {sentence: "Mauris vestibulum pharetra lectus vel venenatis.", label: "SUPPORTS"},
        {sentence: "Nam erat ante, cursus et justo ut, vulputate commodo neque.", label: "REFUTES"}
    ];


    //this function will run the model 
    const runModel=()=>{
        setLoading(true)
        //send text to Python backend
        //retrieve results through api call
        //filter and format
        //set loading to false
        setTimeout(()=>{    //timeout is temporary just simulating waiting for the backend to return
            setLoading(false)
            setCompletion(true)
            //set perecentages
            setvPercent(["1", "2"])
            setrPercent(["3", "4"])
            setneiPercent(["5", 6])
            setPercent([30, 25])

        }, 5000)
    
    }

    const countWords=(e)=>{
        setCount(e.split(/\s+/).filter(Boolean).length);
    }

    const loadSequence="loading, scanning stuff"

    return(
    <>
    <div className="relative min-h-screen overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover -z-10">
            <source src="/public/images/0_Clouds_Sky_3840x2160.mp4" type="video/mp4" />
        </video>
        <div class= "text-[50px] flex justify-center m-none mb-[20px] text-[#195568] md:p-[20px]" >
            <div class="bungee-regular text-7xl pt-4 [text-shadow:4px_0px_0px_#7ae1f3]">SureTex</div>
        </div>

        <div class="text-white bg-[#eeebe4]  h-[150vh] md:h-[75vh] flex flex-col md:flex-row rounded-3xl w-9/10 m-auto mb-4">
            <div class="h-1/2 md:h-full md:w-1/2 p-5 flex flex-col">
                <textarea onChange={(e)=>countWords(e.target.value)} class="text-black placeholder-[#92999a] h-[93%] w-full outline-0 p-1 resize-none" placeholder='Paste your test here' name="" id="myText"></textarea>
                <div class="flex justify-between items-center">
                    <div class=""><button onClick={runModel} class=" bg-[#24afda] hover:bg-[#7ad7f3] shadow-lg shadow-indigo-500/50 rounded-xl w-15 h-8 text-[#eeebe4] mt-2">Scan</button></div>
                    <div class="text-[#92999a]">{wordCount}/600</div>
                </div>
            </div>
            <div class=" bg-[#24afda] h-1/2 md:h-full md:w-1/2 border-t-1 border-t-[#dddada] md:border-t-0 md:border-l-1 md:border-l-[#dddada] p-5 md:mx-auto flex flex-col items-center justify-center gap-7 rounded-b-3xl md:rounded-r-3xl md:rounded-l-none">
                {loading? 
                    <div class="flex">
                        {loadSequence.split("").map((letter, i) => (
                            <div key={i} className="loader" style={{ animationDelay: `${i * 0.05}s` }}>{letter}</div>
                        ))}
                    </div>
                :
                <>
                    <div class="text-black flex w-3/4 justify-between bg-[#F5EFFF] rounded-4xl text-2xl items-center">
                        <button onClick={()=>setModel("roberta")} class={`${model==="roberta" && "bg-[#E5D9F2]"} p-3 rounded-4xl w-1/2 h-full`}>
                            <div class="flex justify-center ">
                                <img class="w-9" src="/images/letter-r.png" alt="" />
                                <div>BERTa</div>
                            </div> 
                        </button>
                        <button onClick={()=>setModel("distillbert")} class={`${model==="distillbert" && "bg-[#E5D9F2]"} p-3 rounded-4xl w-1/2 h-full`}>
                            <div class="flex justify-center items-center ">
                                <img class="w-6 " src="/images/letter-d.png" alt="" />
                                <div class="ml-0 ">istillBERT</div>
                            </div> 
                        </button>
                    </div>
        
                    <div class="text-2xl">{verifiable}% of this text appears to be verifiable</div>
                    <div class="relative w-64 h-40 flex items-center justify-center">
                        <svg viewBox="0 0 200 120" class="w-full">
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="#ddd"
                                stroke-width="20"
                                stroke-linecap="round"
                            />

                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="#5BA393"
                                stroke-width="20"
                                stroke-linecap="round"
                                stroke-dasharray="251"
                                stroke-dashoffset={251-((251/100)*percent[1])}
                            />
                        </svg>

                        <span class="absolute text-4xl font-bold mt-22">{verifiable}%</span>
                    </div>

                    <div class="text-lg w-[70%] flex flex-col gap-3">
                        <div class="flex items-center justify-between"> 
                            <div class="flex items-center"><FaCircle class="mr-2 text-[#32c999] size-7  "></FaCircle> Supports</div> 
                            <div>{verifiable}%</div>
                        </div>
                        <div class="flex items-center justify-between"> 
                            <div class="flex items-center"><FaCircle class="mr-2 text-[#f54d4d] size-7"></FaCircle> Refutes</div> 
                            <div>{refutes}%</div>
                        </div>
                        <div class="flex items-center justify-between"> 
                            <div class="flex items-center"><FaCircle class="mr-2 text-[#f0bf1b] size-7"></FaCircle> Not Enough Info</div> 
                            <div>{notEI}%</div>
                        </div>
                    </div>
                </>}    

            </div>
        </div>

        {completed &&
        <>
        <div class=" text-xl w-9/10 m-auto mb-4 bg-white p-10 rounded-3xl">
          <div class="flex flex-col justify-center items-center gap-5">
            <div class="text-3xl font-bold text-[#24afda] ">Verification Analysis</div>
            <div>
            {labeledSentences.map((s, index)=>(
                <span class={` ${s.label=="SUPPORTS" && "bg-[#32c99945]" || s.label=="REFUTES" && "bg-[#f54d4d40]" || s.label=="NOT ENOUGH INFO" && "bg-[#f3e84e64]"}` } key={index}>{s.sentence} </span>
            ))}
            </div>
          </div>
        </div>
        </>
        }
    </div>

    </>

    )
}

export default App


//LEFT TODO: 
// Fix the lines on arc
// Maybe add all 3 percentages for arc
