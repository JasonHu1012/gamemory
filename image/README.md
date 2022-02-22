### how to add images

- The python programs below use *PIL* and *imagehash*, if not installed:

  ```shell
  pip3 install pillow
  pip3 install imagehash
  ```

- Put the images of one category under ```pic/temp/```
- If the category's directory  doesn't exist, create it
- ```python3 cut.py``` and type in the category, this program will cut all the images under ```pic/temp``` into squares and number them based on how many images in the category's directory.
- ```python3 duplicate.py``` and type in the category, this program will find out the same images (by ```diff```) and remove it (by ```mv```).
- ```python3 count.py``` and check the result, if nothing wrong, copy the result into ```num.js``` or just ```python3 count.py > num.js```.
- Now the new images are added.