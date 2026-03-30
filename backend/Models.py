from transformers import AutoTokenizer, AutoModel
from transformers import AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
import evaluate
import torch
import torch.nn.functional as F
import numpy as np
import torch
from datasets import load_dataset
#Reminder this code line is only here to test on mac
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
#We will load our model
News_model= AutoModelForSequenceClassification.from_pretrained("./Model_2")
New_tokenizer = AutoTokenizer.from_pretrained("./Model_2")
News_model.to(device)

#Reminder, you need to get the actual roberta model
evidence_model= AutoModelForSequenceClassification.from_pretrained("./Model_8")
evidence_tokenizer=AutoTokenizer.from_pretrained("./Model_8")
evidence_model.to(device)
#you would place the name of the model here

feverDataset=load_dataset("copenlu/fever_gold_evidence")
label_map={
    "SUPPORTS": 0,
    "REFUTES": 1,
    "NOT ENOUGH INFO": 2
}
def news_tokenizer(dataset):
    return New_tokenizer(
        dataset["title"], dataset["text"], truncation=True,padding=True, max_length=512
    )
    
def evidence_tokenization(dataset):
    evidences=[]
    for e in dataset["evidence"]:
        if len(e)>0:
            text=" ".join([ev[2] for ev in e])
        else:
            text=""
        evidences.append(text)

    return evidence_model(
        dataset["claim"],
        evidences,
        truncation=True,
        padding=True,
        max_length=512
    )

def map_labels(labels):
    return {"label": [label_map[m] for m in labels["label"]]}

#The following classes are for the compute metrics
accuracy_metric= evaluate.load("accuracy")
precision_metrics= evaluate.load("precision")
recall_metrics= evaluate.load("recall")
f1_metric= evaluate.load("f1")
#These can be used individually for each task
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
#These can be used individually for each task
def evidence_compute_metrics(eval_preds):
    logits, labels=eval_preds
    predicts=np.argmax(logits, axis=-1)
    acc=accuracy_metric.compute(predictions=predicts, references=labels)["accuracy"]
    macro_f1=f1_metric.compute(predictions=predicts, references=labels, average="macro")["f1"]    #macro since there are way more "SUPPORTS" then the other 2 labels
    weighted_f1=f1_metric.compute(predictions=predicts, references=labels, average="weighted")["f1"]
    per_class=f1_metric.compute(predictions=predicts, references=labels, average=None )["f1"]
    return {
            "accuracy": acc,
            "macro_f1": macro_f1,
            "weighted_f1": weighted_f1,
            "f1_supports": per_class[0],
            "f1_refutes": per_class[1],
            "f1_nei": per_class[2],
            }
news_training_args= TrainingArguments(
    output_dir="./News_results", #Changed because it doesn't require a large number for a small portion
    per_device_eval_batch_size=16,

)
news_trainer=Trainer(
    model=News_model,
    args=news_training_args,
    processing_class=New_tokenizer,
    compute_metrics=news_compute_metrics,
)

evidence_training_args=TrainingArguments(
    output_dir="./evidence_results",
    per_device_eval_batch_size=16
)
evidence_trainer=Trainer(
    model=evidence_model,
    args=evidence_training_args,
    processing_class=evidence_tokenizer,
    compute_metrics=evidence_compute_metrics,
)
def run_roberta(text):
    inputs= evidence_tokenizer(
        text, return_tensors="pt",
        truncation=True, padding=True
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs=evidence_model(**inputs)
    logits=outputs.logits
    probs= F.softmax(logits,dim=1)
    probs=probs.tolist()[0]
    return [round(probs[0] * 100, 2),  # SUPPORTS
    round(probs[1] * 100, 2),  # REFUTES
    round(probs[2] * 100, 2)   # NEI
    ]
def run_distilbert(text):
    inputs= New_tokenizer(
        text, return_tensors="pt",
        truncation=True, padding=True
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs=News_model(**inputs)
    logits=outputs.logits
    probs= F.softmax(logits,dim=1)
    probs=probs.tolist()[0]
    real = round(probs[1] * 100, 2)
    fake = round(probs[0] * 100, 2)
    return {"vPercent": [real, real],     #REAL:"verifiable"
        "rPercent": [fake, fake],     # FAKE""refutes"
        "neiPercent": [0, 0],         # no NEI
        "percent": [real, fake]    
}