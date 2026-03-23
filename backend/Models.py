from transformers import AutoTokenizer, AutoModel
from transformers import AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
import evaluate
import torch
import torch.nn.functional as F

#We will load our model
Trained_model= AutoModelForSequenceClassification.from_pretrained("./Model_2")
New_tokenizer = AutoTokenizer.from_pretrained("./Model_2")
def preprocess_function(examples):
    return New_tokenizer(examples["title"], examples["text"], truncation=True, max_length=512)

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
training_args= TrainingArguments(
    output_dir="./Model_2_results", #Changed because it doesn't require a large number for a small portion
    per_device_eval_batch_size=16,

)
trainer=Trainer(
    model=Trained_model,
    args=training_args,
    processing_class=New_tokenizer,
    compute_metrics=news_compute_metrics,
)
def run_roberta(text):
    
    
    return result
def run_distilbert(text):
    inputs= New_tokenizer(
        text, return_tensors="pt",
        truncation=True, padding=True
    )
    with torch.no_grad():
        outputs=Trained_model(**inputs)
    logits=outputs.logits
    probs= F.softmax(logits,dim=1)
    probs=probs.tolist()[0]
    return probs