#!/bin/bash
#

MAJORNUMBER=0
MINORNUMBER=0
PATCHNUMBER=$(cat nextpatchnumber.txt)
VERSIONNUMBER=$MAJORNUMBER.$MINORNUMBER.$PATCHNUMBER
echo "[patch_versionnumber.sh] new version number: $VERSIONNUMBER"

# 
rm ../version-*.txt
# "git add" also has to "add" the deletion!
# git add ../version-*.txt

# create new versionnumber file
touch "../version-$VERSIONNUMBER.txt"
#'git add' causes staging!
# git add ../version-$VERSIONNUMBER.txt

# FILENAME=src/js/config.json
# rm $FILENAME
# cp $FILENAME.ori $FILENAME
# sed -i "s/__MAJORVERSION__/$MAJORNUMBER/g" $FILENAME
# sed -i "s/__MINORVERSION__/$MINORNUMBER/g" $FILENAME
# sed -i "s/__PATCHVERSION__/$PATCHNUMBER/g" $FILENAME
# sed -i "s/__VERSION__/$VERSIONNUMBER/g" $FILENAME
# git add $FILENAME  2>warning.txt
# echo "[patch_versionnumber.sh] patch $FILENAME"

FILENAME=./package.json
rm $FILENAME
cp $FILENAME.ori.json $FILENAME
sed -i "s/__MAJORVERSION__/$MAJORNUMBER/g" $FILENAME
sed -i "s/__MINORVERSION__/$MINORNUMBER/g" $FILENAME
sed -i "s/__PATCHVERSION__/$PATCHNUMBER/g" $FILENAME
git add $FILENAME  2>warning.txt
echo "[patch_versionnumber.sh] patch $FILENAME"
sleep 4

# FILENAME=../h5p/development/H5P.FormulaApplet-$MAJORNUMBER.$MINORNUMBER/library.json
# rm $FILENAME
# cp $FILENAME.ori $FILENAME
# sed -i "s/__MAJORVERSION__/$MAJORNUMBER/g" $FILENAME
# sed -i "s/__MINORVERSION__/$MINORNUMBER/g" $FILENAME
# sed -i "s/__PATCHVERSION__/$PATCHNUMBER/g" $FILENAME
# git add $FILENAME  2>warning.txt
# echo "[patch_versionnumber.sh] patch $FILENAME"

((PATCHNUMBER=PATCHNUMBER+1))
echo $PATCHNUMBER > ./nextpatchnumber.txt
git add ./nextpatchnumber.txt  2>warning.txt

rm ./warning.txt
# "git add" has to "add" the deletion only if stashed before!

# https://linuxconfig.org/bash-script-pause-script-before-proceeding
read -p "Pausing for 60 seconds" -t 60

