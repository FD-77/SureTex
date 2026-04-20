from transformers import AutoTokenizer, AutoModel
from transformers import AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
from huggingface_hub import hf_hub_download
import evaluate
import torch
import torch.nn.functional as F
import numpy as np
import torch
from datasets import load_dataset


model_path = hf_hub_download(repo_id="MisaelProfessional/Two_head_Model_FT2_CPU", filename="TwoTask_single_session_FT2_CPU.pt")

model_id="MisaelProfessional/Two_head_Model_FT2_CPU"