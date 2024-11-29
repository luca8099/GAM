from pymongo import MongoClient

# Stringa di connessione URI per MongoDB Atlas.
uri = "mongodb+srv://lezioni:itsfoggia@cluster0.u7ews.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Crea un client MongoDB utilizzando l'URI fornito.
client = MongoClient(uri)

db = client['project_group4']