import { useState, useEffect, useRef } from 'react';
import { FaCircle, FaCheck, FaXmark, FaInfo, FaCircleInfo} from "react-icons/fa6";

const MainPage=()=>{
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
    const [percent, setPercent]=useState([0, 0])
    const [includeOpinion, setOpinionOption]= useState(false)
    const index = model === "roberta" ? 0:1;
    const real_fake_model= model ==="distilbert"
    const gauge = real_fake_model ? (verifiable > refutes ? verifiable : refutes) : (percent[index] > rPercent[index] ? percent[index] : rPercent[index]) || 0;
    const [details,setDetails]=useState([]);
    useEffect(() => {
        const real= parseFloat(vPercent?.[index])|| '--';
        const fake = parseFloat(rPercent?.[index]) || '--';
        if(model=="distilbert"){
            setVerifiable(real);
            setRefutes(fake);
            setnotEI(0);
        }
        else{
            setVerifiable(vPercent[index]);
            setRefutes(rPercent[index]);
            setnotEI(neiPercent[index]);
        }
    }, [model, vPercent, rPercent,neiPercent])

    //this function will run the model 
    const runModel=async()=>{
        
        setLoading(true)
        try{
            const response= await fetch("http://127.0.0.1:8000/predict",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    text:text,
                    model:model
                })
            });
            const data= await response.json();

            //We will now update the values of the percentage
            setvPercent(data.vPercent || [0,0]);
            setrPercent(data.rPercent || [0,0]);
            setneiPercent(data.neiPercent || [0,0]);
            setPercent(data.percent || [0,0]);
            setDetails(data.details || [])
            setCompletion(true);
            
        } catch (error){
            console.error("Backend error", error);
        } finally {
            setLoading(false);
        }
    }
    const getinfo = (prediction) =>{
        if(!prediction) return "Not Enough Information";
        const{supports,refutes,nei}=prediction;
        if(supports >= refutes && supports>=nei){
            return "Supports";
        }
        if(refutes >= supports && refutes >= nei){
            return "Refutes";
        }
        return "Not Enough Information";
    }

    const countWords=(e)=>{
        setCount(e.split(/\s+/).filter(Boolean).length);
    }

    const loadSequence1= "Loading\u00A0text"
    const loadSequence2= "Tokenizing"
    const loadSequence3= "Running\u00A0Model"
    return(
        <div>
        <div class="text-white bg-[#eeebe4]  h-[150vh] md:h-[75vh] flex flex-col md:flex-row rounded-3xl w-9/10 m-auto mb-4">
            <div class="h-1/2 md:h-full md:w-1/2 p-5 flex flex-col gap-3">
                <textarea onChange={(e)=>{setText(e.target.value);countWords(e.target.value)}} class="text-black placeholder-[#92999a] h-[93%] w-full outline-0 p-1 resize-none" placeholder='Paste your text here' name="" id="myText"></textarea>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-5">
                        <button onClick={runModel} class=" bg-[#24afda] hover:bg-[#7ad7f3] shadow-lg shadow-indigo-500/50 rounded-xl w-15 h-8 text-[#eeebe4]">Scan</button>
                        <div className='flex gap-2 items-center'>
                            <button onClick={()=>setOpinionOption(!includeOpinion)} class={`${includeOpinion? 'bg-[#8bd36c]' : 'bg-[#aaaaaa]'} text-white  w-18 h-8 rounded-xl`}>
                            {includeOpinion?
                                <div class="text-2xl flex items-center justify-between mx-1">
                                    <FaCheck class="text-[#49ba27]"></FaCheck>
                                    <FaCircle class="" ></FaCircle>
                                </div>
                                :
                                <div class="text-2xl flex items-center justify-between mx-1">
                                   <FaCircle class="" ></FaCircle>
                                   <FaXmark class="text-[#ba4927]"></FaXmark>
                                    
                                </div>
                            }
                        </button>
                        <div className='text-black'>Include Opinions?</div>
                        </div>
                        
                    </div>
                    <div class="text-[#92999a]">{wordCount}/600</div>
                </div>
            </div>
            <div class=" relative bg-[#24afda] h-1/2 md:h-full md:w-1/2 border-t border-t-[#dddada] md:border-t-0 md:border-l md:border-l-[#dddada] p-5 md:mx-auto flex flex-col items-center justify-center gap-7 rounded-b-3xl md:rounded-r-3xl md:rounded-l-none">
            <div class="text-[#f8f4f4] text-2xl absolute right-0 top-0 m-2 group">
                <FaCircleInfo class="hover:text-[#f5afa3]"/>
                <div className=' bg-[#fafafa] text-black w-md absolute opacity-0  invisible transition duration-200 mr-0 right-0 z-50 text-sm rounded-2xl p-2 border-l-6 border-[#f12b2b] group-hover:opacity-100 group-hover:visible'>
                    RoBERTA model: Trained on FEVER data.<br /> DistilBERT Model: Trained on Kaggle data.<br /> *Disclaimer: Not to be taken as fact. Trained models are not substitutes for humans. Please do your own research.*
                    </div>
            </div>

                {loading? 
                    <div class="text-xl">
                    <div class="flex ">
                        {loadSequence1.split("").map((letter, i) => 
                            (<div key={i} className="loader" style={{ animationDelay: `${i * 0.05}s` }}>{letter}</div>)
                        )}
                    </div>
                    <div class="flex">
                        {loadSequence2.split("").map((letter, i) => 
                            (<div key={i} className="loader" style={{ animationDelay: `${i * 0.05}s` }}>{letter}</div>)
                        )}
                    </div>
                    <div class="flex">
                        {loadSequence3.split("").map((letter, i) => 
                            (<div key={i} className="loader" style={{ animationDelay: `${i * 0.05}s` }}>{letter}</div>)
                        )}
                    </div>
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
                        <button onClick={()=>setModel("distilbert")} class={`${model==="distilbert" && "bg-[#E5D9F2]"} p-3 rounded-4xl w-1/2 h-full`}>
                            <div class="flex justify-center items-center ">
                                <img class="w-6 " src="/images/letter-d.png" alt="" />
                                <div class="ml-0 ">istillBERT</div>
                            </div> 
                        </button>
                    </div>
        
                    <div class="text-2xl">
                        {real_fake_model ? (verifiable < refutes ? `${refutes}% chance this text is Fake` : `${verifiable}% chance this text is Real`) : 
                        (verifiable < refutes ? `${refutes}% chance this text is Refuted` : `${verifiable}% chance this text is Supported`)}</div>
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
                                stroke={
                                    verifiable > refutes ? "#5BA393" 
                                    :verifiable <refutes ? "#f54d4d"
                                    : "#ddd"}
                                stroke-width="20"
                                stroke-linecap="round"
                                stroke-dasharray="251"
                                stroke-dashoffset={251-((251/100)* gauge)}
                            />
                        </svg>

                        <span class="absolute text-4xl font-bold mt-22">{gauge}%</span>
                    </div>

                    <div class="text-lg w-[70%] flex flex-col gap-3">
                        {model=="roberta" &&
                        <>
                            <div class="flex items-center justify-between"> 
                                <div class="flex items-center"><FaCircle class="mr-2 text-[#32c999] size-7  "></FaCircle>Supports</div> 
                                <div>{verifiable}%</div>
                            </div>
                            <div class="flex items-center justify-between"> 
                                <div class="flex items-center"><FaCircle class="mr-2 text-[#f54d4d] size-7"></FaCircle>Refutes</div> 
                                <div>{refutes}%</div>
                            </div>
                            <div class="flex items-center justify-between"> 
                                <div class="flex items-center"><FaCircle class="mr-2 text-[#f0bf1b] size-7"></FaCircle> Not Enough Info</div> 
                                <div>{notEI}%</div>
                        </div>
                        </>
                        }
                        
                        {model=="distilbert" &&
                        <>
                            <div class="flex items-center justify-between"> 
                                <div class="flex items-center"><FaCircle class="mr-2 text-[#32c999] size-7  "></FaCircle>Real</div> 
                                <div>{verifiable}%</div>
                            </div>
                            <div class="flex items-center justify-between"> 
                                <div class="flex items-center"><FaCircle class="mr-2 text-[#f54d4d] size-7"></FaCircle>Fake</div> 
                                <div>{refutes}%</div>
                            </div>
                        </>}

                        
                    </div>
                    </>
                }    

            </div>
        </div>

        {completed &&
        <>
        <div class=" text-xl w-9/10 m-auto mb-4 bg-white p-10 rounded-3xl">
            <div class="flex flex-col justify-center items-center gap-5">
                <div class="text-3xl font-bold text-[#24afda] ">Verification Analysis</div>
                <div>
                {details.map((item,index) =>{
                    const label = getinfo(item.prediction);
                    return(
                        <div key={index} className="mb-4">
                            <span className={label ==="Supports" ? "bg-[#32c99945]" : label ==="Refutes" ? "bg-[#f54d4d40]" : "bg-[#f3e84e64]"}>{item.claim}</span>
                        </div>);
                            }
                )}
                </div>
            </div>
        </div>
        </>
        }
    </div>
    )
}
export default MainPage;