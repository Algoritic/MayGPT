FROM python:3.11-alpine 
RUN apk add --no-cache --virtual .build-deps \  
    build-base \  
    libffi-dev \  
    openssl-dev \  
    curl \  
    && apk add --no-cache \  
    libpq \  
    && pip install --no-cache-dir uwsgi  
  
COPY requirements.txt /usr/src/app/  
RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt \  
    && rm -rf /root/.cache  
   
EXPOSE 8000 
CMD ["uwsgi", "--http", ":8000", "--wsgi-file", "app.py", "--callable", "app", "-b","32768"]  
