# train-timer
This is a train schedule tracking application created as a homework assignment for my UW coding boot camp

# implementation notes
Per the assignment I linked this web application to a firebase database to store data.

I stored the first train time as a unix timestamp, to be translated back into human readable time when the table is populated. I made the logical assumption that once a train runs for the first time, it runs at its frequency interval indefinitely isntead of, say, stopping at midnight and resuming at the same 'first time' the next day.

To calculate when the next train is coming, first I got the different between the current timestamp and the stored 'first time' of the train from the database in minutes. This returns the number of minutes that have passed since the train came - which means that if the train hasn't come yet, that number will be negative. 

If the number is positive, it means the train has come, so I have to figure out how many minutes until the next one. To get this, I divide the number of minutes since the train came by the train frequency- the remainder here tells me how how many minutes to add to the current time to get when the train will next come.