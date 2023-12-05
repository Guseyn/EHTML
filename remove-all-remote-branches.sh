#!/bin/bash
git branch | grep -v "master" | xargs git push origin --delete
git branch | grep -v "master" | xargs git branch -D