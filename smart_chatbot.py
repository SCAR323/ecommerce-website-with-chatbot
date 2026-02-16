
import torch
import numpy as np
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    AutoModel,
)
class EmbeddingMemory:
    def __init__(self):
        print("[Memory] Loading sentence embedding model...")
        self.model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        self.tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

        self.knowledge = [
            "Our earbuds have 40ms low-latency mode and 8 hours battery backup.",
            "Headphones come with active noise cancellation and powerful bass.",
            "Smartwatches track heart rate, steps, calories, and sleep quality.",
            "Bluetooth speakers provide 24-hour battery and waterproof design.",
            "All products come with a 1-year replacement warranty."
        ]

        self.embeddings = self.encode_texts(self.knowledge)

    def encode_texts(self, texts):
        tokens = self.tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**tokens)
        embeddings = outputs.last_hidden_state.mean(dim=1)
        return embeddings / embeddings.norm(dim=1, keepdim=True)

    def retrieve(self, query, top_k=1):
        q_tokens = self.tokenizer(query, return_tensors="pt")
        with torch.no_grad():
            q_emb = self.model(**q_tokens).last_hidden_state.mean(dim=1)
        q_emb = q_emb / q_emb.norm()

        scores = torch.matmul(self.embeddings, q_emb.T).squeeze()
        best_idx = torch.topk(scores, top_k).indices.tolist()

        return [self.knowledge[i] for i in best_idx]


class SmartChatbot:
    def __init__(self):
        print("[Chatbot] Loading T5 model...")
        self.model_name = "t5-small"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)

        self.memory = EmbeddingMemory()

        print("[Chatbot] Ready!")

    def generate(self, user_input):
        retrieved = self.memory.retrieve(user_input, top_k=1)[0]

        prompt = (
            f"Context: {retrieved}\n"
            f"Question: {user_input}\n"
            f"Answer in simple language:"
        )

        tokens = self.tokenizer(prompt, return_tensors="pt", truncation=True)
        output = self.model.generate(
            **tokens,
            max_new_tokens=80,
            num_beams=5,
            early_stopping=True
        )

        return self.tokenizer.decode(output[0], skip_special_tokens=True)

if __name__ == "__main__":
    bot = SmartChatbot()

    print("\n----------------------------")
    print("     SMART AI CHATBOT")
    print("----------------------------")
    print("Ask anything about products!")
    print("Type 'exit' to quit.\n")

    while True:
        user = input("You: ")

        if user.lower() == "exit":
            print("Chatbot: Goodbye!")
            break

        reply = bot.generate(user)
        print("Chatbot:", reply)
