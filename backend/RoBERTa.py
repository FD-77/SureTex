from transformers import AutoTokenizer, AutoModel
from transformers import AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
import evaluate
import torch
import torch.nn.functional as F
import numpy as np
import torch
from datasets import load_dataset

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model_id="FatoumataDrammeh/myRoBERTa-FactVerificationModel"
evidence_model= AutoModelForSequenceClassification.from_pretrained(model_id)
evidence_tokenizer=AutoTokenizer.from_pretrained(model_id)
evidence_model.to(device)
#you would place the name of the model here

feverDataset=load_dataset("copenlu/fever_gold_evidence")
label_map={
    "SUPPORTS": 0,
    "REFUTES": 1,
    "NOT ENOUGH INFO": 2
}

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


def run_roberta(claim, evidence):
    inputs= evidence_tokenizer(
        claim,evidence, return_tensors="pt",
        truncation=True, padding=True,max_length=512
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs=evidence_model(**inputs)
    logits=outputs.logits
    probs= F.softmax(logits,dim=1)[0]
    return {
    "supports": probs[0].item(),  # SUPPORTS
    "refutes": probs[1].item(),  # REFUTES
    "nei": probs[2].item()   # NEI
    }
