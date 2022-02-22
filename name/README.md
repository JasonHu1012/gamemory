### how to add faces

- The python programs below use *PIL* and *requests*, if not installed:

  ```shell
  pip3 install pillow
  pip3 install requests
  ```

- ```python3 generate.py```, and the program will download 100 faces from [https://thispersondoesnotexist.com/image]().

- ```python3 duplicate.py``` to ensure that no faces are the same (I believe that this is redundant.), and the program also update ```facenum.js```.

- Now new faces are added.

### how to add names

- Put the names you want to add into ```temp.txt```; put one name in one line.
- ```python3 add_name.py```, and the program will put the names in ```temp.txt``` into ```names.txt``` and update ```name.js```; there will be no duplicate names.
- Now new names are added.