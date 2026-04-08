from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend import getEvidence
from distilbert import run_distilbert
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
    
    if input.model=="roberta":
        print("Placeholder until we have roberta model")
        evidence= getEvidence(input.text)
        results=[]
        for _,row in evidence.iterrows():
            single_claim= row["Claim"]
            evidence_list=row["Evidence"]
            if not evidence_list:
                prediction= {"SUPPORTS":0,"REFUTES":0, "NEI":100}
            else:
                total_evidence=" ".join(evidence_list)
                prediction= run_roberta(single_claim,total_evidence)
            results.append({
                "claim":single_claim,
                "evidence":evidence_list,
                "prediction":prediction
            })
        result=results
    elif input.model=="distilbert":
        print("DistilBERT Model")
        result=run_distilbert(input.text)

    return result
