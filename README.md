# Automating tasks for Lillebror backend service #


### Import dictionary ###
    
    $ gulp download-dictionary
    
or set enviroment varaible `lang=en` for downloading en-sv dictionary:
    
    $ gulp download-dictionary lang=en


### Setup Elasticseach for development ###

    $ mkdir esdata
    $ docker run -d -v "$PWD/esdata":/usr/share/elasticsearch/data -p 9300:9200 elasticsearch

#### Stop Elasticsearch dameon ####
    
    $ docker ps
    $ docker stop <elasticsearch CONTAINER ID>

Now navigate to [localhost:9300](localhost:9300), should be able to see elasticsearch server is up and running
