#!/bin/bash

mkdir -p /var/www/html/axios-burp/
cd docs
zip -r axios-burp.zip *
rm -rf /var/www/html/axios-burp/*
mv axios-burp.zip /var/www/html/axios-burp/
cd /var/www/html/axios-burp/
unzip axios-burp.zip
rm axios-burp.zip
