#!/usr/bin/env bash

LOG_FILE=/var/log/sqy_analyzer/access.log

python3 analyzer_v2.py | tee -a $LOG_FILE