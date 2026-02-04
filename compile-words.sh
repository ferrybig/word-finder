#!/bin/sh
grep -E '^[a-z]{4,16}$' opentaal-wordlist/wordlist.txt | sort -u | jq -R -s 'split("\n") | map(select(length > 0))' > src/compiled-words.json
cp opentaal-wordlist/LICENSE.txt src/compiled-words-license.txt
