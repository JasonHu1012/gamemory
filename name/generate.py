from PIL import Image
import requests
import os

allpic = os.listdir("pic/")
count = len(allpic)
for i in allpic:
    if i[-4:] != ".jpg":
        count -= 1
for i in range(100):
    Image.open(requests.get("https://thispersondoesnotexist.com/image", stream=True).raw).save("pic/" + str(count) + ".jpg")
    count += 1
    print(i)
