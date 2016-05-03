# usr/bin/python -tt

import pandas as pd
from dateutil import parser
import datetime
import numpy as np
from pandas.tseries.resample import TimeGrouper
import json, sys, pprint
import csv

# Learn about API authentication here: https://plot.ly/pandas/getting-started
# Find your api_key here: https://plot.ly/settings/api
# Cufflinks binds plotly to pandas dataframes in IPython notebook. Read more

from pymongo import MongoClient


global_mongo = None
global_db = None
global_coll = None


def _connect_mongo(host, port, username, password, db):
    """ A util for making a connection to mongo """

    if username and password:
        mongo_uri = 'mongodb://%s:%s@%s:%s/%s' % (username, password, host, port, db)
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)


    return conn[db]


def read_mongo(db, collection, query={}, host='localhost', port=27017, username=None, password=None, no_id=True):
    """ Read from Mongo and Store into DataFrame """

    # Connect to MongoDB
    db = _connect_mongo(host=host, port=port, username=username, password=password, db=db)

    # Make a query to the specific DB and Collection
    cursor = db[collection].find(query)

    # Expand the cursor and construct the DataFrame
    dataframe =  pd.DataFrame(list(cursor))

    # Delete the _id
    if no_id:
        del dataframe['_id']

    return dataframe


def add_record_to_mongo(mongo, record):
  global global_mongo
  global global_db
  global global_coll
  
  mongo_bits = mongo.split('.')
  mongo_db = mongo_bits[0]
  mongo_coll = mongo_bits[1]
  ##print 'Load a record!\n'
  #pprint.pprint(record)
  
  if global_mongo == None: global_mongo = MongoClient()
  if global_db == None: global_db = global_mongo[mongo_db]
  if global_coll == None: global_coll = global_db[mongo_coll]
  
  # Now let's insert
  #print 'COLL: {coll}'.format(coll=global_coll)
  global_coll.insert(record)


def run_csv_file(csvfile, mongo):
  print 'Loading the CSV file "{csvfile}" into mongodb "{mongo}"\n'.format(csvfile=csvfile, mongo=mongo)
  with open(csvfile,'rb') as incsv:
    parsed = csv.DictReader(incsv, delimiter=',', quotechar='"')
    print mongo
    for record in parsed:
      add_record_to_mongo(mongo, record)
    global_mongo.close()

'''def write_mongo(db, collection,dframe, query={}, host='localhost', port=27017, username=None, password=None, no_id=True):
    """ Read from Mongo and Store into DataFrame """

    # Connect to MongoDB
    db = _connect_mongo(host=host, port=port, username=username, password=password, db=db)

    # Make a query to the specific DB and Collection
    #db.collection.insert_many(dframe.to_dict('records'))
    db.collection.drop()
    header = ['timestamp','temp','value_x','value_y']
    for each in reader:
    row={}
    for field in header:
        row[field]=each[field]

    db.collection.insert(row)

    # Expand the cursor and construct the DataFrame
    print 'Written to db'   '''


def groupAndCompute(df, ts, outfile, col_names ):
    grouped = df.groupby(TimeGrouper(freq=ts))
    #print grouped.temperature.sum()/grouped.temperature.count()
    if len(col_names) == 2:
        r1 = grouped.value1.sum()/grouped.value1.count() 
        result = pd.concat([r1], axis=1)
        result = result[np.isfinite(result['value1'])]
  
    elif len(col_names) == 4:
        r1 = grouped.value1.sum()/grouped.value1.count()
        r2 = grouped.value2.sum()/grouped.value2.count()
        r3 = grouped.value3.sum()/grouped.value3.count()
        result = pd.concat([r1,r2,r3], axis=1)

    elif len(col_names) == 6:
        r1 = grouped[col_names[1]].sum()/grouped.value1.count()
        r2 = grouped.value2.sum()/grouped.value2.count()
        r3 = grouped.value3.sum()/grouped.value3.count()
        r4 = grouped.value4.sum()/grouped.value4.count()
        r5 = grouped.value5.sum()/grouped.value5.count()
        result = pd.concat([r1, r2,r3,r4,r5], axis=1)
    result = result.fillna(method='pad', limit=1)
    result.to_csv(outfile)
    collection = str(outfile).split('.')
    run_csv_file(outfile, 'analyticsDB.'+collection[0])
    #grouped = df.groupby(TimeGrouper(freq='Min'))
    #print grouped.Source.sum()
    #import pandas
def date_parser(string_list):
    return [datetime.datetime.fromtimestamp(int(x)/1000).strftime('%Y-%m-%d %H:%M:%S') for x in string_list]


def readCSV(fname):
    f = open(fname,'r')
    reader = csv.reader(f,delimiter=',')
    num_cols = len(next(reader))
    names = []
    for i in xrange(num_cols):
        if i == 0:
            name = 'timestamp'
        else: 
            name = 'value'+str(i)
        names.append(name)
    return names


#dataDB = read_mongo('rovermonDB','MPU')
col_names = readCSV('MPU.csv')
dataf1 = pd.read_csv('MPU.csv', parse_dates=[0], date_parser=date_parser, header=None, index_col='timestamp', names=col_names)
groupAndCompute(dataf1,'1S','rmonMPUsec.csv', col_names)
groupAndCompute(dataf1,'1Min', 'rmonMPUmin.csv', col_names)

col_names = readCSV('temperatures_t.csv')
dataf2 = pd.read_csv('temperatures_t.csv', parse_dates=[0], date_parser=date_parser, header=None, index_col='timestamp', names=col_names)
groupAndCompute(dataf2,'1S','rmonTempsec.csv',col_names)
groupAndCompute(dataf2,'1Min', 'rmonTempmin.csv', col_names)

col_names = readCSV('random.csv')
dataf3 = pd.read_csv('random.csv', parse_dates=[0], date_parser=date_parser, header=None, index_col='timestamp', names=col_names)
groupAndCompute(dataf3,'1Min','rmonRandomsec.csv', col_names)
groupAndCompute(dataf3,'5Min', 'rmonRandommin.csv', col_names)

#write_mongo('rovermonDB','MPUanalytics', result)