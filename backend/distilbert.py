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

def news_tokenizer(dataset):
    return New_tokenizer(
        dataset["title"], dataset["text"], truncation=True,padding=True, max_length=512
    )


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

def run_distilbert(text):
    inputs= New_tokenizer(
        text, return_tensors="pt",
        truncation=True, padding=True
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs=News_model(**inputs)
    logits=outputs.logits
    probs= F.softmax(logits,dim=1)[0]
    real = probs[1].item()
    fake = probs[0].item()
    return {"real": real,     #REAL:"verifiable"
        "fake": fake,     # FAKE""refutes"  
}