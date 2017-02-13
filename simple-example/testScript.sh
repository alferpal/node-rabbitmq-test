#!/bin/zsh

for i in {0..1000}
do
  node newTask $i-0 &
  node newTask $i-1 &
done
