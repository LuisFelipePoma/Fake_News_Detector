import re
from consts.consts import SEQUENCE_LENGTH
from model.vocab import VOCAB
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from rake_nltk import Rake
import nltk

nltk.download('stopwords')
nltk.download('wordnet')


# FUNCTION TO HANDLE DATA
def handleData(data: dict):
    """
    This module contains functions to handle and clean text data for a fake news detection model.

    Functions:
    - handleData(data: dict) -> dict
    - decontract(text: str) -> str
    - cleanData(jsonData: dict) -> list
    - processing_text(text: str) -> str
    """
    tokens = cleanData(data)
    while(len(tokens) < SEQUENCE_LENGTH):
        tokens.append(0)
    data["tokens"] = tokens
    return data


# FUNCTION TO CLEAN DATA
def cleanData(jsonData: dict):
    """
    Cleans the text data from a JSON object by removing HTML tags, numbers, punctuation, and applying tokenization and embedding.

    Args:
        jsonData (dict): A dictionary containing the text data to be cleaned.

    Returns:
        list: A list of integers representing the embedded tokens of the cleaned text data.
    """

    # Get the text from the JSON
    text = jsonData["content"] + " " + jsonData["title"]

    # Decompress contracted forms of words
    text = decontract(text)

    # Processing text
    text = processing_text(text)
 
    # Tokenization
    tokens = text.lower().split()

    # Filter
    tokens = list(filter(lambda x: "snopes" not in x, tokens))

    # Embedding
    indices = set()
    for token in tokens:
        if len(indices) == SEQUENCE_LENGTH:
            break
        indice = VOCAB.get(token)
        if indice is not None:
            indices.add(indice)
        else:
            indices.add(0)
    indices = list(indices)

    return indices


# FUNCTION TO EXTRACT KEYWORDS
def extract_keywords(text):
    r = Rake()
    r.extract_keywords_from_text(text)
    return r.get_ranked_phrases()


# FUNCTION TO DECONTRACT TEXT
def decontract(text: str):
    """
    Replaces contracted forms of words with their expanded forms.

    Args:
        text (str): The text to decontract.

    Returns:
        str: The decontracted text.
    """
    contractions = {
        r"won[’']t": "will not",
        r"can[’']t": "cannot",
        r"i[’']m": "i am",
        r"ain[’']t": "is not",
        r"(\w+)[’']ll": r"\1 will",
        r"(\w+)n[’']t": r"\1 not",
        r"(\w+)[’']ve": r"\1 have",
        r"(\w+)[’']s": r"\1 is",
        r"(\w+)[’']re": r"\1 are",
        r"(\w+)[’']d": r"\1 would",
    }

    for contraction, expansion in contractions.items():
        text = re.sub(contraction, expansion, text, flags=re.IGNORECASE)

    return text


# FUNCTION TO CREATE TEXT
def processing_text(text):
    """
    This function takes in a string of text and performs several preprocessing steps on it,
    including removing URLs, special characters, numbers, and stop words, as well as lemmatizing
    the remaining words. The resulting preprocessed text is returned as a string.

    Args:
        text (str): The input text to be preprocessed.

    Returns:
        str: The preprocessed text with URLs, special characters, numbers, and stop words removed,
        and the remaining words lemmatized.
    """

    # Expresión regular para encontrar enlaces
    regex_enlaces = re.compile(r"https?://\S+|www.\S+", re.IGNORECASE)

    # Elimina los enlaces del texto
    processed_feature = regex_enlaces.sub("", text)

    # most important sentences
    r = Rake(language="english")
    r.extract_keywords_from_text(processed_feature)

    most_important = r.get_ranked_phrases_with_scores()
    processed_feature = list(map(lambda x: x[1], most_important))
    processed_feature = " ".join(processed_feature)

    # 1. Limpiar textos
    processed_feature = re.sub(
        r"[^a-zA-Z0-9 ]", "", str(processed_feature)
    )  # Remover con un expresión regular carateres especiales (no palabras).
    # processed_feature = re.sub(r'\^[a-zA-Z]\s+', ' ', processed_feature) # Remover ocurrencias de caracteres individuales
    processed_feature = re.sub(
        r"[0-9]+", " ", processed_feature
    )  #  Remover números (Ocurrencias muy esporádicas en nuestro dataset)
    processed_feature = processed_feature.lower()  # Pasar todo el texto a minúsculas

    # 2. Stop words
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words("english"))

    # 3. Lemmatization
    processed_feature = processed_feature.split()
    processed_feature = " ".join(
        [
            lemmatizer.lemmatize(word)
            for word in processed_feature
            if word not in stop_words
        ]
    )
    # Remover ocurrencias de caracteres individuales
    processed_feature = re.sub(r"\b[a-zA-Z]\b", "", processed_feature)

    # Simplificar espacios concecutivos a un único espacio entre palabras
    processed_feature = re.sub(" +", " ", processed_feature)
    return processed_feature
