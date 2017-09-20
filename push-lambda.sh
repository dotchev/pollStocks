#!/bin/sh

set -ex

zip -r -u pollStocks . -x @exclude.lst
aws lambda update-function-code --function-name pollStocks --zip-file fileb://pollStocks.zip --publish
