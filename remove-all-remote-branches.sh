#!/bin/bash
git branch -r | grep -v 'origin/master' | sed 's/origin\///' | xargs -I {} git push origin --delete {}
git branch | grep -v "master" | xargs git branch -D