from transformers import (AutoTokenizer, AutoModel,AutoModelForSequenceClassification,
    Trainer, TrainingArguments)
import torch.nn as nn
import torch
import pandas as pd
from datasets import Dataset
import evaluate
from sklearn.metrics import confusion_matrix
from datasets import load_dataset
import numpy as np
from huggingface_hub import hf_hub_download
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model_path = hf_hub_download(repo_id="MisaelProfessional/Two_head_Model_FT2_CPU", filename="TwoTask_single_session_FT2_CPU.pt")
checkpoint = torch.load(model_path, map_location=device)

class_weights = checkpoint["class_weights"].to(device)
class two_TaskModel(nn.Module):
    #Let's build our constructor
    #let's put a place holder for the model_name
    def __init__(self,model_name):
        super(two_TaskModel,self).__init__()
        #load the headless Model
        self.encoder = AutoModel.from_pretrained(model_name)
        #Load the number of hidden size of distilbert or RoBERTa
        hidden_size = self.encoder.config.hidden_size
        #We will create our outputs for the fake/real news, it is similar to the num_label
        self.real_or_fake= nn.Linear(hidden_size,2)
        #Same goes for the fever dataset
        self.evidence_based= nn.Linear(hidden_size,3)
        #self.current_task=None
        #To prevent overfitting we will drop some neurons during training.
        self.dropout= nn.Dropout(0.3)
    
    def forward(self,input_ids,attention_mask,labels=None,task=None):
        outputs=self.encoder(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        
        cls_outputs= outputs.last_hidden_state[:,0,:]
        cls_output= self.dropout(cls_outputs)
        
        #The following lines of code will decide which head to use
        #this is different from the actual training architecture
        if (task==0).all():
            logits= self.real_or_fake(cls_output)
            loss_fn= nn.CrossEntropyLoss()
        elif (task==1).all():
            logits = self.evidence_based(cls_output)
            loss_fn = nn.CrossEntropyLoss(weight=class_weights)
        else:
            raise ValueError("Please select the right task")
        loss=None
        if labels is not None:
            loss= loss_fn(logits,labels)
        
        return {"loss": loss, "logits": logits}



model = two_TaskModel("distilbert-base-uncased")
model.load_state_dict(checkpoint["Two_task_single_session"])

model.to(device)
model.eval()
tokenizer=AutoTokenizer.from_pretrained("distilbert-base-uncased")
def news_tokenizer(dataset):
    return tokenizer(
        dataset["title"], dataset["text"], truncation=True,padding="max_length", max_length=512, return_token_type_ids=False
    )
accuracy_metric= evaluate.load("accuracy")
precision_metrics= evaluate.load("precision")
recall_metrics= evaluate.load("recall")
f1_metric= evaluate.load("f1")
def news_compute_metrics(eval_pred):
    logits,labels=eval_pred
    preds= np.argmax(logits,axis=1)
    
    accuracy= accuracy_metric.compute(predictions=preds, references=labels)["accuracy"]
    precision= precision_metrics.compute(predictions=preds, references=labels, average="binary")["precision"]
    recall= recall_metrics.compute(predictions=preds, references=labels, average="binary")["recall"]
    f1= f1_metric.compute(predictions=preds,references=labels, average="binary")["f1"]
    
    return {
        "accuracy":accuracy,
        "precision":precision,
        "recall":recall,
        "f1":f1
    }

def add_task_news(data_set):
    data_set["task"]=0#News will be 0
    return data_set
training_args= TrainingArguments(
    output_dir="./Two_head_results", #Changed because it doesn't require a large number for a small portion
    per_device_eval_batch_size=16,

)
class Two_Task_Trainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        task=inputs.pop("task")
        print(task)
        labels=inputs.pop("labels")
        input_ids=inputs["input_ids"]
        attention_mask=inputs["attention_mask"]
        loss=0
        total_samples=0
        outputs_all={}
        
        mask_news=(task==0)
        mask_evidence=(task==1)
        if mask_news.any():
            outputs_news=model(input_ids=input_ids[mask_news],attention_mask=attention_mask[mask_news],task=0)
            logits_news=outputs_news["logits"]
            label_news=labels[mask_news]
            
            loss_news=nn.CrossEntropyLoss()(logits_news,label_news)
            loss+=loss_news*label_news.size(0)
            total_samples+=label_news.size(0)
            outputs_all["news_logits"]= logits_news
        if mask_evidence.any():
            outputs_evidence=model(input_ids=input_ids[mask_evidence],attention_mask=attention_mask[mask_evidence],task=1)
            logits_evidence= outputs_evidence["logits"]
            label_evidence=labels[mask_evidence]
            loss_evidence=nn.CrossEntropyLoss(weight=class_weights)(logits_evidence,label_evidence)
            loss+= loss_evidence*label_evidence.size(0)
            total_samples+=label_evidence.size(0)
            outputs_all["evidence_logits"]=logits_evidence
        loss=loss/total_samples
        
        return (loss,outputs_all) if return_outputs else loss
trainer=Trainer(
    model=model,
    args=training_args,
    processing_class=news_tokenizer,
    compute_metrics=news_compute_metrics,
)
def run_distilbert(text):
    inputs= tokenizer(
        text, return_tensors="pt",
        truncation=True, padding=True, return_token_type_ids=False
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    task=torch.zeros(inputs["input_ids"].size(0),dtype=torch.long).to(device)
    
    with torch.no_grad():
        outputs=model(input_ids=inputs["input_ids"], attention_mask=inputs["attention_mask"],task=task)
    probs=torch.softmax(outputs["logits"],dim=1)[0]
    real = probs[1].item()
    fake = probs[0].item()
    return {"real": real,     #REAL:"verifiable"
        "fake": fake,     # FAKE""refutes"  
}
