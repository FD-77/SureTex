import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

import { useState, useRef } from "react";

const GamePage=()=>{
    //BackEndNotes: In the beginnine of every render, send an API request to get 10 random title/texts from the csv
    const [index, setIndex]=useState(0)
    const [score, setScore]=useState(0)
    const answers=useRef([])
    const articles = [
        {title: "Why Late Night Ideas Feel So Brilliant", text: "There is something about late nights that makes ideas feel more interesting and important than they did during the day. Maybe it is the quiet, maybe it is the lack of distractions, or maybe your brain is just tired enough to stop overthinking every possibility. Many creative people say their best ideas appear when the world slows down. The trick is writing them down, because by morning they might not seem nearly as revolutionary.", "label": 0},
        {title: "The Unexpected Joy of Fixing Small Problems", text: "Solving a small problem can sometimes feel more satisfying than finishing a huge project. Whether it is organizing your desk, fixing a bug in your code, or finally understanding a confusing concept, these small wins add up. They give you momentum and confidence. Over time, a series of tiny improvements can completely transform how you work and how you feel about your progress.", "label": 1},
        {title: "How Curiosity Changes the Way You Learn", text: "Learning becomes much easier when curiosity is involved. When you genuinely want to understand something, your brain starts looking for connections everywhere. Articles, videos, conversations, and random observations suddenly become useful pieces of information. Curiosity turns learning into exploration rather than obligation, and that shift alone can make even difficult subjects feel more approachable.", "label": 0},
        {title: "Why Trying New Things Feels Uncomfortable", text: "Whenever you try something new, there is always a moment where you feel slightly lost. That feeling is normal and actually a sign that your brain is adjusting to unfamiliar information. The discomfort disappears once patterns start forming and things begin to make sense. Many people stop too early, but if you push past that confusing stage, the reward is usually a new skill or perspective.", "label": 1},
        {title: "The Quiet Satisfaction of Finishing Tasks", text: "Finishing something simple can bring a surprising sense of relief. A cleaned room, a completed assignment, or a solved coding problem all create the same quiet satisfaction. It is not dramatic or exciting, but it builds a sense of order and accomplishment. These moments remind you that progress does not always have to be big to feel meaningful.", "label": 0},
        {title: "Why Simple Routines Make Life Easier", text: "Routines remove the need to constantly decide what to do next. When certain actions become automatic, your brain has more space to focus on bigger decisions. A simple routine like organizing your day, preparing things the night before, or setting aside time to learn can make everyday life feel less chaotic. Structure often creates more freedom than people expect.", "label": 1},
        {title: "The Strange Motivation of Deadlines", text: "Deadlines have a unique ability to focus attention. Tasks that seemed impossible a week earlier suddenly become manageable when time is limited. While constant pressure is not healthy, occasional deadlines can help push projects forward. They create urgency and encourage you to stop overthinking and start actually doing the work.", "label": 0},
        {title: "Why Learning in Small Steps Works", text: "Trying to learn everything at once usually leads to frustration. Breaking a topic into small pieces makes progress easier to track and understand. Each step builds on the previous one, slowly forming a clearer picture of the subject. Over time, these small pieces combine into real knowledge and skill, even if the progress feels slow at first.", "label": 1},
        {title: "The Value of Building Things Yourself", text: "There is a different level of understanding that comes from building something yourself. Reading about a concept is helpful, but actually creating something forces you to confront the details. You encounter mistakes, unexpected behavior, and new questions. Those challenges are exactly what deepen your knowledge and make the final result more rewarding.", "label": 0},
        {title: "Why Progress Often Feels Invisible", text: "When you work on something every day, improvement can be difficult to notice. Progress tends to happen gradually rather than all at once. Looking back after a few weeks or months often reveals how much you have actually learned or accomplished. The key is continuing even when the improvement feels slow, because consistent effort eventually becomes visible.", "label": 1}
    ];

    function increment(id){
        if (id=="true"){
            answers.current.push(0)
        }
        else{
            answers.current.push(1)
        }
        if (index<=8){
            setIndex(prev=>prev+1)
        }
        else{
            setIndex(index+1)
            let result=0;
            for (let i=0; i<10; i++){
                if (answers.current[i]==articles[i].label){
                    result=result+1
                    console.log("Result=",result)
                }
            setScore(result)
            }     
        }
    }
    function restart(){
        setIndex(0)
        setScore(0)
        answers.current=[]
    }   
    return(
        <>
        <div class="flex items-center justify-center mb-10 ">
            {index!=10? 
            <div class="bg-[#cbdef0] w-5/6 max-h-screen flex flex-col gap-3 items-center p-5 rounded-4xl">
                <div class="text-3xl font-bold m-5">{articles[index].title}</div>
                <div class="text-xl overflow-y-auto ">{articles[index].text}</div>
                <div class="flex justify-center gap-20">
                    <button onClick={()=>increment("true")} class="flex items-center gap-2 text-3xl text-[#0c6a1a] p-2 rounded-4xl bg-[#76bf7b75] hover:bg-[#ffffff75] "> <FaCircleCheck /> <div>True</div></button>
                    <button onClick={()=>increment("false")} class="flex items-center gap-2 text-3xl text-[#a11212] p-2 rounded-4xl bg-[#b6272775] hover:bg-[#ffffff75]"> <FaCircleXmark /> <div>False</div></button>
                </div>
            </div>
            :
            <div class="flex flex-col items-center font-serif w-9/10 gap-3">
                <FaStar class="text-7xl"></FaStar>
                <div class="text-5xl">QUIZ COMPLETED</div>
                <div class="text-2xl">RESULTS: YOU GOT</div>
                <div class="text-9xl">{score}/10</div>
                <div class="text-5xl">CORRECT!</div>
                <div className="flex text-6xl ">
                    <FaStar className={`${score>=1 ? "text-[#ec2929]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=2 ? "text-[#f14a3d]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=3 ? "text-[#f66a52]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=4 ? "text-[#f9936d]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=5 ? "text-[#fdb58f]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=6 ? "text-[#e9a5c1]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=7 ? "text-[#d67dd8]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=8 ? "text-[#a863e0]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=9 ? "text-[#7352e6]": "opacity-30"}`}></FaStar>
                    <FaStar className={`${score>=10 ? "text-[#3f109c]": "opacity-30"}`}></FaStar>
                </div>
                <button onClick={restart}class="text-2xl bg-[#e2bc69] p-3 rounded-4xl">Try Again</button>

            </div>
            }
        </div>
        </>
    )
}
export default GamePage;