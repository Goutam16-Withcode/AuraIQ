#!/bin/bash

mkdir -p ~/.streamlit/

echo "\
[server]\n\
headless = true\n\
port = $PORT\n\
enableCORS = false\n\
enableXsrfProtection = false\n\
\n\
[theme]\n\
primaryColor = \"#7e22ce\"\n\
backgroundColor = \"#0f0f1e\"\n\
secondaryBackgroundColor = \"#1e3c72\"\n\
textColor = \"#ffffff\"\n\
font = \"sans serif\"\n\
" > ~/.streamlit/config.toml
