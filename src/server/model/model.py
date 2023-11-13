import re
from model.vocab import VOCAB
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from rake_nltk import Rake
from keras.preprocessing.sequence import pad_sequences


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
    max_sequence_length = 250

    # Get the text from the JSON
    text = jsonData["content"] + " " + jsonData["title"]

    # Remove all HTML tags
    text = re.sub(r"<[^>]*>", "", text)

    # Decompress contracted forms of words
    text = decontract(text)

    # Processing text
    text = processing_text(text)

    # Remove numbers and punctuation
    text = re.sub(r"[0-9!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~’”]", "", text)

    # Keywords of the text
    # r = Rake()
    # r.extract_keywords_from_text(text)
    # score = r.get_ranked_phrases_with_scores()
    # score = sorted(lambda x: x[0], reversed=True)
    # print(score)
    # print(r.get_ranked_phrases_with_scores())

    # Tokenization
    tokens = text.lower().split()

    # Filter
    tokens = list(filter(lambda x: "snopes" not in x, tokens))
    print(tokens)

    # Embedding
    indices = []
    for token in tokens:
        indice = VOCAB.get(token)
        if indice is not None:
            indices.append(indice)
        else:
            indices.append(0)

    indices = pad_sequences(
        [indices], maxlen=max_sequence_length, padding="post", truncating="post"
    )
    indices = indices.tolist()[0]
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
    text = re.sub(r"won\'t", "will not", text)
    text = re.sub(r"can\'t", "can not", text)
    text = re.sub(r"n\'t", " not", text)
    text = re.sub(r"\'re", " are", text)
    text = re.sub(r"\'s", " is", text)
    text = re.sub(r"\'d", " would", text)
    text = re.sub(r"\'ll", " will", text)
    text = re.sub(r"\'t", " not", text)
    text = re.sub(r"\'ve", " have", text)
    text = re.sub(r"\'m", " am", text)
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
