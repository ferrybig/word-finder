#!/bin/sh
grep -E '^[a-z]{4,16}$' "10_000-most-used-words-in-Dutch/10.000 meestgebruikte woorden in het Nederlands.txt" | sort -u | jq -R -s 'split("\n") | map(select(length > 0))' > src/compiled-words-most-used.json
cp "10_000-most-used-words-in-Dutch/LICENSE" src/compiled-words-most-used-license.txt
grep -E '^[a-z]{4,16}$' opentaal-wordlist/wordlist.txt | sort -u | jq -R -s 'split("\n") | map(select(length > 0))' > src/compiled-words-opentaal.json
cp opentaal-wordlist/LICENSE.txt src/compiled-words-opentaal-license.txt
