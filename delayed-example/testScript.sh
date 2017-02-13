#!/bin/zsh

for i in {0..10}
do
  node newTask $i-0 &
  node newTask $i-1 &
done
