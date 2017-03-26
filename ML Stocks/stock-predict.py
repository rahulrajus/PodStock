import requests
import sys
import numpy as np
import os

from keras.models import Sequential
from keras.layers import Dense
from textblob import TextBlob

file = 'historical.csv'

def get_name(symbol):
    url = "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={}&region=1&lang=en".format(symbol)
    result = requests.get(url).json()
    for x in result['ResultSet']['Result']:
        if x['symbol'] == symbol:
            return x['name']

def get_data(quote):
    url = 'http://www.google.com/finance/historical?q=NASDAQ%3A'+quote+'&output=csv'
    r = requests.get(url, stream = True)

    if r.status_code != 400:
        with open(file, 'wb') as fl:
            for line in r:
                fl.write(line)
    return True

def predict(quote):
    data = []
    with open(file) as f:
        for num, line in enumerate(f):
            if num != 0:
                data.append(float(line.split(',')[1]))
    data = np.array(data)

    def create_set(data):
        datax = [data[n+1] for n in range(len(data)-2)]
        return np.array(datax), data[2:]

    trainx, trainy = create_set(data)

    classifier = Sequential()
    classifier.add(Dense(8, input_dim = 1, activation = 'relu'))
    classifier.add(Dense(1))
    classifier.compile(loss = 'mean_squared_error', optimizer = 'adam')
    classifier.fit(trainx, trainy, nb_epoch= 200, batch_size = 2, verbose = 2)

    classifier.save(quote + "ml.model")

    prediction = classifier.predict(np.array([data[0]]))
    return '%s from %s to %s' % (quote, data[0], prediction[0][0])

quote = input('Enter stock quote: ').upper()


if not get_data(quote):
    print ('ERROR, please re-run the script')

print(predict(quote))

os.remove(file)
