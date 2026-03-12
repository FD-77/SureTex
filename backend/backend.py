import re
import spacy
import requests
import json
import pandas as pd
from sentence_transformers import CrossEncoder

input="Get from front end"
df=[]
sentences=re.split(r"(?<=\.)\s|\n", input)
for sentence in sentences:
    if sentence!='':
        df.append({"Claim": sentence})

nlp=spacy.load("en_core_web_sm")
for row in df:
    doc=nlp(row["Claim"])
    text=""
    for token in doc:
        if token.pos_ in ["PROPN", "NOUN"] or token.ent_type_!="":
            text= text+ " "+token.text
    row["Shortened Claim"]=text

url = "https://en.wikipedia.org/w/api.php"
headers={'User-Agent': 'CoolBot/0.0// (https://example.org/coolbot/;coolbot@example.org)'}
for row in df:
    searchQuery=row["Shortened Claim"]

    PARAMS = {
        "action": "query",
        "generator": "search",
        "gsrsearch": searchQuery,
        "prop":"extracts",
        "exintro": "1",
        "explaintext": "1",
        "format": "json",
        "exlimit": "3"
    }
    r=requests.get(url, params=PARAMS, headers=headers).json()
    try:
        evidence=r["query"]["pages"]
    except:
        evidence=""
    i=0;
    ev=[]
    while (i<=2):
        for f in evidence:
            try:
                text=r["query"]["pages"][f]["extract"]
                text=re.split(r"(?<=\.)\s+|\n+", text)
                ev+=text
                i+=1
                continue
            except:
                i+=1
                continue
        row["All Extracts"]=[e for e in ev if e!=""]

model=CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
for row in df:
    query=row["Claim"]
    passages=row["All Extracts"]
    ranks=model.rank(query, passages, top_k=3)
    top_sentences=[passages[r["corpus_id"]] for r in ranks]
    row["Evidence"]=top_sentences

pd.set_option("display.max_colwidth", None)
df=pd.DataFrame(df)
df
# Send to model to predict
# Send results to frontend