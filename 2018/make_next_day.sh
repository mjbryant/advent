#!/bin/bash
DAY=$(ls | grep day_ | sed 's/day_//' | sort | tail -n1)
NEXT_DAY=$((DAY+1))
NEXT_DIR=day_${NEXT_DAY}
mkdir -p $NEXT_DIR
mkdir -p ${NEXT_DIR}/part_a
mkdir -p ${NEXT_DIR}/part_b
cp -r .template/* ${NEXT_DIR}/part_a/
cp -r .template/* ${NEXT_DIR}/part_b/
