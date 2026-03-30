from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Models import run_distilbert, run_roberta
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
        result=run_roberta(input.text)
    elif input.model=="distilbert":
        print("DistilBERT Model")
        result=run_distilbert(input.text)

    return result
