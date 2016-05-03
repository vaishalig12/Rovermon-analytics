import pandas as pd
from dateutil import parser
import datetime
import numpy as np
from pandas.tseries.resample import TimeGrouper



#grouped = df.groupby(TimeGrouper(freq='Min'))
#print grouped.Source.sum()
#import pandas
def date_parser(string_list):
    return [datetime.datetime.fromtimestamp(int(x)/1000).strftime('%Y-%m-%d %H:%M:%S') for x in string_list]


df = pd.read_csv('random.csv', parse_dates=[0], date_parser=date_parser, header=None, index_col='timestamp', names=['timestamp','t1'])
grouped = df.groupby(TimeGrouper(freq='Min'))
#print grouped.temperature.sum()/grouped.temperature.count()
r1 = grouped.t1.sum()/grouped.t1.count() 

result = pd.concat([r1], axis=1)
print result