import { useState, useEffect, use } from 'react';
import { FaCircle } from "react-icons/fa6";
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
    const [percent, setPercent]=useState([12, 25])
    const index = model === "roberta" ? 0:1;
    const real_fake_model= model ==="distilbert"
    const gauge = real_fake_model ? verifiable : percent[index];

    useEffect(() => {
        const real= parseFloat(vPercent[index])|| 0;
        const fake = parseFloat(rPercent[index]) || 0;
        if(real_fake_model){
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
            setvPercent(data.vPercent);
            setrPercent(data.rPercent);
            setneiPercent(data.neiPercent);
            setPercent(data.percent);
            setCompletion(true);
            
        } catch (error){
            console.error("Backend error", error);
        } finally {
            setLoading(false);
        }
    
    }

    const countWords=(e)=>{
        setCount(e.split(/\s+/).filter(Boolean).length);
    }

    const loadSequence="loading, scanning stuff"
    return(
        <div>
        <div class="text-white bg-[#eeebe4]  h-[150vh] md:h-[75vh] flex flex-col md:flex-row rounded-3xl w-9/10 m-auto mb-4">
            <div class="h-1/2 md:h-full md:w-1/2 p-5 flex flex-col">
                <textarea onChange={(e)=>{setText(e.target.value);countWords(e.target.value)}} class="text-black placeholder-[#92999a] h-[93%] w-full outline-0 p-1 resize-none" placeholder='Paste your test here' name="" id="myText"></textarea>
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
                        <button onClick={()=>setModel("distilbert")} class={`${model==="distilbert" && "bg-[#E5D9F2]"} p-3 rounded-4xl w-1/2 h-full`}>
                            <div class="flex justify-center items-center ">
                                <img class="w-6 " src="/images/letter-d.png" alt="" />
                                <div class="ml-0 ">istillBERT</div>
                            </div> 
                        </button>
                    </div>
        
                    <div class="text-2xl">{real_fake_model ? `${verifiable}% chance this text is real` : `${verifiable}% of this text appears to be verifiable`}</div>
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
                                stroke-dashoffset={251-((251/100)* gauge)}
                            />
                        </svg>

                        <span class="absolute text-4xl font-bold mt-22">{verifiable}%</span>
                    </div>

                    <div class="text-lg w-[70%] flex flex-col gap-3">
                        <div class="flex items-center justify-between"> 
                            <div class="flex items-center"><FaCircle class="mr-2 text-[#32c999] size-7  "></FaCircle> {real_fake_model ? "Real" : "Supports"}</div> 
                            <div>{verifiable}%</div>
                        </div>
                        <div class="flex items-center justify-between"> 
                            <div class="flex items-center"><FaCircle class="mr-2 text-[#f54d4d] size-7"></FaCircle> {real_fake_model ? "Fake": "Refutes"}</div> 
                            <div>{refutes}%</div>
                        </div>
                        {!real_fake_model &&(
                        <div class="flex items-center justify-between"> 
                            <div class="flex items-center"><FaCircle class="mr-2 text-[#f0bf1b] size-7"></FaCircle> Not Enough Info</div> 
                            <div>{notEI}%</div>
                        </div>
                        )}
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
    )

}
export default MainPage;