from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Models import run_roberta,run_distilbert
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
        result=run_roberta(input.text)
    elif input.model=="distilbert":
        result=run_distilbert(input.text)
    text= input.text
    result = run_model(text)
    return {"message":"We will now start the operations"}



@app.get("/2")
def ending():
    return {"message":"We are done in the backend"}