#sudo sh  ./deployment.sh
az webapp config appsettings set -g mbb-ai-engineering -n mbb-mss-ea-chatbot --settings WEBSITE_WEBDEPLOY_USE_SCM=false
az webapp up --runtime PYTHON:3.11 --sku B2 --name mbb-mss-ea-chatbot --resource-group mbb-ai-engineering
