from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend import getEvidence
from distilBERT2_head import run_distilbert
from RoBERTa import run_roberta
from transformers import AutoTokenizer, AutoModel
from transformers import AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
app= FastAPI()
#frontend and backend run on different origins for local:host.
#communication will be block unless we allow them to communicate
origins=[    "http://localhost:3000", # Example for create-react-app
    "http://localhost:5173", # Example for Vite
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Allows all specified origins
    allow_credentials=True,       # Allows cookies/auth headers to be sent
    allow_methods=["*"],          # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],          # Allows all headers
)

#We will make a class for the input text 
#It will turn the input into string
class InputText(BaseModel):
    text:str
    model:str
@app.post("/predict")
def begin(input:InputText):
    vPercent=[0,0]
    rPercent=[0,0]
    neiPercent=[0,0]
    percent=[0,0]
    results=[]
    if input.model=="roberta":
        print("RoBERTa Model")
        evidence= getEvidence(input.text,0)
        total_s=0
        total_r=0
        total_nei=0
        count=0
        
        for _,row in evidence.iterrows():
            single_claim= row["Claim"]
            evidence_list=row["Evidence"]
            if not evidence_list:
                prediction= {"supports":0,"refutes":0, "nei":1}
            else:
                total_evidence=" ".join(evidence_list)
                prediction= run_roberta(single_claim,total_evidence)
            total_s +=prediction["supports"]
            total_r += prediction["refutes"]
            total_nei += prediction["nei"]
            count+=1
            results.append({
                "claim":single_claim,
                "evidence":evidence_list,
                "prediction":prediction
            })
            print("Predictions: ",prediction)
        if count >0:
            vPercent[0]= round((total_s/count) * 100,2)
            rPercent[0]=round((total_r/count) * 100, 2)
            neiPercent[0]=round((total_nei/count) * 100, 2)
            percent[0]= vPercent[0]
        result=results
    elif input.model=="distilbert":
        print("DistilBERT Model")
        result=run_distilbert(input.text)
        print("Results: ")
        vPercent[1]= round((result["real"]) * 100,2)
        rPercent[1]=round((result["fake"]) * 100, 2)
        neiPercent[1]=0
        percent[1]= vPercent[1]

    return {
        "vPercent": vPercent,     #REAL:"verifiable"
        "rPercent": rPercent,     # FAKE""refutes"
        "neiPercent": neiPercent,         # no NEI
        "percent": percent,
        "details":results
    }
